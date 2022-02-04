import { Listener, OrderCancelledEvent, Subjects } from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queue-group-name';
import Ticket from '../../models/ticket';
import TicketUpdatedPublisher from '../publishers/ticket-updated-publisher';

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly qGroupName = queueGroupName;
    readonly subject = Subjects.OrderCancelled;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) throw new Error('Ticket not found');

        ticket.orderId = undefined;
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
