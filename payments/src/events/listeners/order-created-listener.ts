import { OrderCreatedEvent, Subjects } from "@tkmaster/common";
import Listener from "@tkmaster/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import queueGroupName from "../queue-group-name";
import Order from "../../model/order";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
