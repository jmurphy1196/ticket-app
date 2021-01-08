import Listener from "@tkmaster/common/build/events/base-listener";
import {
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@tkmaster/common";
import { Message } from "node-nats-streaming";
import queueGroupName from "./queue-group-name";
import Order from "../../model/order";
import OrderCancelledPublisher from "../publishers/order-cancelled-publisher";

export default class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) throw new Error("order not found");

    if (order.status === OrderStatus.Complete)
      throw new Error("Order has already been paid");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    console.log("ORDER CANCELLED");
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
