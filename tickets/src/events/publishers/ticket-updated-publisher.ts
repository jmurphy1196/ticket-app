import { Subjects, Publisher, TicketUpdatedEvent } from "@tkmaster/common";

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
