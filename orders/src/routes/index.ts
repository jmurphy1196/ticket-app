import express, { Request, Response, NextFunction, response } from "express";
import { currentUser, requireAuth } from "@tkmaster/common";
import Order from "../model/order";
const router = express.Router();

router.get(
  "/api/orders",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );
    console.log(orders);
    res.status(200).send(orders);
  }
);

export { router as indexOrderRouter };
