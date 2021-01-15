import Listener from "@tkmaster/common/build/events/base-listener";
import { OrderCreatedEvent, Subjects } from "@tkmaster/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import Ticket, { TicketDoc } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket: TicketDoc = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("ticket not found");

    ticket.set({ orderId: data.id });
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
