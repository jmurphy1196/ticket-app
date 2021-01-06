import express, { Request, Response, NextFunction, response } from "express";
import {
  NotAuthorizedError,
  currentUser,
  requireAuth,
  NotFoundError,
  OrderStatus,
} from "@tkmaster/common";
import Order, { OrderDoc } from "../model/order";
import OrderCancelledPublisher from "../events/publishers/order-cancelled-publisher";
import natsWrapper from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;

    const order: OrderDoc | null = await Order.findById(orderId).populate(
      "ticket"
    );

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    console.log(`order status: ${order.status}`);

    order.status = OrderStatus.Cancelled;

    await order.save();

    //TODO emit event order cancelled

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send({ ...order });
  }
);

export { router as deleteOrderRouter };
