import { PaymentCreatedEvent, Publisher, Subjects } from "@tkmaster/common";

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
