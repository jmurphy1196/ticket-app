import express, { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page } = req.query;
    let amount = serializeQueryParams(limit, 10);
    let pageNumber = serializeQueryParams(page, 1);
    const tickets = await Ticket.find({ orderId: undefined })
      .limit(amount)
      .skip(amount * (pageNumber - 1));
    res.status(200).send(tickets);
  }
);

const serializeQueryParams = (query: any, def: number) => {
  if (query && typeof query === "string") {
    if (!isNaN(+query)) return +query;
  }
  return def;
};

export { router as indexTicketRouter };
