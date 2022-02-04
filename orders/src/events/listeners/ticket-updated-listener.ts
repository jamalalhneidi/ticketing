import { Listener, Subjects, TicketUpdatedEvent } from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import queueGroupName from './q-group-name';

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly qGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        console.log(
            `Message Received: [${this.subject}] / [${this.qGroupName}]\n`,
            data
        );
        const ticket = await Ticket.findByIdVersioned(data);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.title = data.title;
        ticket.price = data.price;
        await ticket.save();

        msg.ack();
    }
}
