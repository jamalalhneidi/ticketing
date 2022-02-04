import { Listener, OrderCreatedEvent, Subjects } from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queue-group-name';
import Ticket from '../../models/ticket';
import TicketUpdatedPublisher from '../publishers/ticket-updated-publisher';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly qGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) throw new Error('Ticket not found');

        ticket.orderId = data.id;
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
        });

        msg.ack();
    }
}
