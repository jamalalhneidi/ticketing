import { Listener, OrderCreatedEvent, Subjects } from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queue-group-name';
import expirationQueue from '../../queues/expiration-queue';
import moment from 'moment';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly qGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log(
            `Message Received: [${this.subject}] / [${this.qGroupName}]\n`,
            data
        );
        const delay = moment(data.expiresAt).diff(moment(), 'ms');
        console.log(`Order [${data.id}] scheduled to expire after ${delay} ms`);
        await expirationQueue.add(
            { orderId: data.id },
            {
                delay,
            }
        );

        msg.ack();
    }
}
