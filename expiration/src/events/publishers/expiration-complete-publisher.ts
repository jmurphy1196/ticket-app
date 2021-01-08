import { Publisher, ExpirationCompleteEvent, Subjects } from "@tkmaster/common";

export default class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
