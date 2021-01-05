import { Subjects, Publisher } from "@tkmaster/common";
import { TicketUpdatedEvent } from "@tkmaster/common/build/events/ticket-updated-event";

export default class TicketCreatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
