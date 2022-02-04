import Ticket from '../../../models/ticket';
import TicketCreatedListener from '../ticket-created-listener';
import nats from '../../../nats-client';
import { TicketCreatedEvent } from '@jagittix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new TicketCreatedListener(nats.client);
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('create a ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.version).toEqual(data.version);
});

it('ack the msg', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
