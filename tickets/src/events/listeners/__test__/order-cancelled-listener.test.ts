import { OrderCancelledEvent } from "@tkmaster/common";
import { Message } from "node-nats-streaming";
import Ticket, { TicketDoc } from "../../../models/ticket";
import natsWrapper from "../../../nats-wrapper";
import OrderCancelledListener from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = global.createMongoId();

  const ticket = Ticket.build({
    title: "concert",
    price: 34,
    userId: global.createMongoId(),
  });
  ticket.set({ orderId: orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: ticket.version,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("orderid on the ticket should be undefined after an order is cancelled", async () => {
  const { listener, data, ticket, msg } = await setup();

  expect(ticket.orderId).toEqual(data.id);

  await listener.onMessage(data, msg);

  const updatedTicket: TicketDoc = await Ticket.findById(data.ticket.id);
  expect(updatedTicket.id).toEqual(ticket.id);
  expect(updatedTicket.orderId).toBeUndefined();
  const publisherInfo = (natsWrapper.client.publish as jest.Mock).mock.calls;
  console.log(publisherInfo);
  expect(msg.ack).toHaveBeenCalled();
});
