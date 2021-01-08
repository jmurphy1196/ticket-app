import ExpirationCompleteListener from "../expiration-complete-listener";
import natsWrapper from "../../../nats-wrapper";
import { ExpirationCompleteEvent } from "@tkmaster/common";
import Ticket from "../../../model/ticket";
import Order from "../../../model/order";
import { OrderStatus } from "@tkmaster/common";
import { Message } from "node-nats-streaming";
const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: global.createMongoId(),
    price: 34,
    title: "LSDKJF",
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: global.createMongoId(),
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("expiration should set order to cancelled and remove orderid prop from ticket ", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(data.orderId).populate("ticket");

  expect(msg.ack).toHaveBeenCalled();
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const pub = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const parsedPub = JSON.parse(pub);
  expect(parsedPub.ticket.id).toEqual(updatedOrder?.ticket.id);
});
