import { TicketUpdatedEvent } from "@tkmaster/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../model/ticket";
import TicketUpdatedListener from "../ticket-updated-listener";
import natsWrapper from "../../../nats-wrapper";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 34,
    title: "sdkljf",
  });

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: 1,
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

it("finds upddates and saves a ticket", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket?.id).toEqual(data.id);
  expect(updatedTicket?.title).toEqual(data.title);
});
