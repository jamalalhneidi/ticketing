import {
    Listener,
    Subjects,
    OrderExpiredEvent,
    OrderStatus,
} from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/order';
import queueGroupName from './q-group-name';
import OrderCancelledPublisher from '../publishers/order-cancelled-publisher';
import nats from '../../nats-client';

export default class OrderExpiredListener extends Listener<OrderExpiredEvent> {
    readonly subject = Subjects.OrderExpired;
    readonly qGroupName = queueGroupName;

    async onMessage(data: OrderExpiredEvent['data'], msg: Message) {
        console.log(
            `Message Received: [${this.subject}] / [${this.qGroupName}]\n`,
            data
        );

        const order = await Order.findById(data.id).populate('ticket');
        if (!order) throw new Error('Order not found');
        if (order.status === OrderStatus.Completed) return msg.ack();

        order.status = OrderStatus.Cancelled;
        await order.save();
        await new OrderCancelledPublisher(nats.client).publish({
            id: order.id,
            ticket: { id: order.ticket.id },
            version: order.version,
        });

        msg.ack();
    }
}
