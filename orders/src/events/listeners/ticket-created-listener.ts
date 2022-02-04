import { Listener, Subjects, TicketCreatedEvent } from '@jagittix/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import queueGroupName from './q-group-name';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly qGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log(
            `Message Received: [${this.subject}] / [${this.qGroupName}]\n`,
            data
        );
        const ticket = Ticket.build({
            id: data.id,
            title: data.title,
            price: data.price,
        });
        await ticket.save();

        msg.ack();
    }
}
