import {
    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects,
} from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './q-group-name';
import Order from '../../models/order';

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    readonly qGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        console.log(
            `Message Received: [${this.subject}] / [${this.qGroupName}]\n`,
            data
        );

        const order = await Order.findById(data.orderId);
        if (!order) throw new Error('Order not found');
        order.status = OrderStatus.Completed;
        await order.save();

        msg.ack();
    }
}
