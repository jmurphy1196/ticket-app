import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent } from "@tkmaster/common";
import Listener from "@tkmaster/common/build/events/base-listener";
import queueGroupName from "./queue-group-name";
import Ticket from "../../model/ticket";
export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id, imageUrl } = data;
    const ticket = Ticket.build({
      title,
      price,
      id,
      imageUrl,
    });
    await ticket.save();

    console.log("ticket was saved to db");

    console.log(ticket);

    msg.ack();
  }
}
