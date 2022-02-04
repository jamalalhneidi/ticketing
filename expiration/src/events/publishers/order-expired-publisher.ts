import { OrderExpiredEvent, Publisher, Subjects } from '@jagittix/common';

export default class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
    readonly subject = Subjects.OrderExpired;
}
