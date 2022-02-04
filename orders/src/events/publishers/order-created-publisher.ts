import { OrderCreatedEvent, Publisher, Subjects } from '@jagittix/common';

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
