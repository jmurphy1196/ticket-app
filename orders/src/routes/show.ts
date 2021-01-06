import express, { Request, Response, NextFunction, response } from "express";
import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@tkmaster/common";
import Order from "../model/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
