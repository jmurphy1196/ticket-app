import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tkmaster/common";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Ticket, { TicketDoc } from "../models/ticket";
import TicketUpdatedPublisher from "../events/publishers/ticket-updated-publisher";
import natsWrapper from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("title must not be empty "),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket: TicketDoc = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    if (ticket.orderId)
      throw new BadRequestError("ticket is currently being ordered");
    if (ticket.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    const { title, price } = req.body;
    ticket.set({
      title,
      price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: req.currentUser!.id,
      version: ticket.version,
      imageUrl: ticket.imageUrl,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
