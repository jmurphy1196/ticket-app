import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tkmaster/common";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import TicketUpdatedPublisher from "../events/publishers/ticket-created-publisher";
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
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;
    ticket.set({
      title,
      price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      ...ticket,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
