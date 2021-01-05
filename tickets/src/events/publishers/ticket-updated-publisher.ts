import { Subjects, Publisher, TicketCreatedEvent } from "@tkmaster/common";

export default class TicketUpdatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
