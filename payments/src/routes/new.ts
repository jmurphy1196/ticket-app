import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from "@tkmaster/common";
import Order, { OrderDoc } from "../model/order";
import stripe from "../stripe";
import Payment from "../model/payment";
import PaymentCreatedPublisher from "../events/publisher/payment-created-publisher";
import natsWrapper from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  currentUser,
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;
    const order: OrderDoc = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("order was cancelled");

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId: orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: orderId,
      stripeId: charge.id,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
