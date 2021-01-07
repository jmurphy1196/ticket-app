import { Subjects, Publisher, TicketCreatedEvent } from "@tkmaster/common";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
