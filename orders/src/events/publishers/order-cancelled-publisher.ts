import { OrderCancelledEvent, Publisher, Subjects } from '@jagittix/common';

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
