import { Publisher, OrderCancelledEvent, Subjects } from "@tkmaster/common";

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
