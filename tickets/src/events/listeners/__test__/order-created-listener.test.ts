import { OrderCreatedEvent, OrderStatus, Subjects } from "@tkmaster/common";
import { Message } from "node-nats-streaming";
import Ticket, { TicketDoc } from "../../../models/ticket";
import natsWrapper from "../../../nats-wrapper";
import OrderCreatedListener from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 34,
    userId: global.createMongoId(),
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: global.createMongoId(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: "sdkflj",
    userId: global.createMongoId(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("a new order should update the tickets order id", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket: TicketDoc = await Ticket.findById(ticket.id);

  expect(updatedTicket.orderId).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  //@ts-ignore
  const payload = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const parsedPayload = JSON.parse(payload);
  expect(parsedPayload.id).toEqual(ticket.id);
});
