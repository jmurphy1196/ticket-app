import express, { Request, Response, NextFunction, response } from "express";
import { currentUser, requireAuth, validateRequest } from "@tkmaster/common";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import TicketCreatedPublisher from "../events/publishers/ticket-created-publisher";
import natsWrapper from "../nats-wrapper";
const router = express.Router();

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);

    res.sendStatus(200);
  }
);

export { router as createTicketRouter };