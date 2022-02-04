import { PaymentCreatedEvent, Publisher, Subjects } from '@jagittix/common';

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
};