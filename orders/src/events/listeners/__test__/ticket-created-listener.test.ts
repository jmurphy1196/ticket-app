import TicketCreatedListener from "../ticket-created-listener";
import natsWrapper from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@tkmaster/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../model/ticket";
const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 34,
    userId: mongoose.Schema.Types.ObjectId.toString(),
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.price).toEqual(data.price);
  expect(ticket?.title).toEqual(data.title);

  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
