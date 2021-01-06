import { Publisher, OrderCreatedEvent, Subjects } from "@tkmaster/common";

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
