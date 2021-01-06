import express, { Request, Response, NextFunction, response } from "express";
import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@tkmaster/common";
import { body } from "express-validator";
import Ticket from "../model/ticket";
import Order from "../model/order";
import OrderCreatedPublisher from "../events/publishers/order-created-publisher";
import natsWrapper from "../nats-wrapper";
const router = express.Router();

const EXPIRATION_WINDOW_SECONDS =
  +process.env.EXPIRATION_WINDOW_SECONDS! || 900;

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticketid must be provided")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("ticket is already ordered");

    const expiration = new Date();
    console.log("THIS IS THE EXP", EXPIRATION_WINDOW_SECONDS);
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();
    console.log("___THIS IS ORDER -> TICKET ID");

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order._id,
      status: order.status,
      userId: order.userId,
      expiresAt: expiration.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    console.log("ORDER SAVED");
    console.log(order);

    res.status(201).send({ ...order, id: order._id.toString() });
  }
);

export { router as newOrderRouter };
