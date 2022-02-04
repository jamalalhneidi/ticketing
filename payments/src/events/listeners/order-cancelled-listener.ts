import {
    OrderCancelledEvent,
    Subjects,
    Listener,
    OrderStatus,
} from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queue-group-name';
import Order from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly qGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByIdVersioned(data);

        if (!order) throw new Error('Order not found');

        order.status = OrderStatus.Cancelled;
        await order.save();

        msg.ack();
    }
}
