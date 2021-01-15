import Listener from "@tkmaster/common/build/events/base-listener";
import { Subjects, OrderCancelledEvent } from "@tkmaster/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Ticket, { TicketDoc } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket: TicketDoc = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("ticket not found");
    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
      imageUrl: ticket.imageUrl,
    });

    msg.ack();
  }
}
