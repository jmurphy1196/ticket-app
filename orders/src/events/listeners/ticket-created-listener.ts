import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent } from "@tkmaster/common";
import Listener from "@tkmaster/common/build/events/base-listener";
import queueGroupName from "./queue-group-name";
import Ticket from "../../model/ticket";
export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price } = data;
    const ticket = Ticket.build({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
