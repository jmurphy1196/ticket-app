import { PaymentCreatedEvent, Subjects, OrderStatus } from "@tkmaster/common";
import Listener from "@tkmaster/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import queueGroupName from "./queue-group-name";
import Order from "../../model/order";

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    console.log(data.orderId);
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
