import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent } from "@tkmaster/common";
import Listener from "@tkmaster/common/build/events/base-listener";
import queueGroupName from "./queue-group-name";
import Ticket from "../../model/ticket";

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    console.log("THIS IS THE DATA PAYLOAD FOR TICKET UPDATED");
    console.log(data);
    const { id, title, price } = data;
    if (!ticket) throw new Error("ticket not found");
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
