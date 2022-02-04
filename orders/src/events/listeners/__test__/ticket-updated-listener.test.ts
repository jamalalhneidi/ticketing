import Ticket from '../../../models/ticket';
import nats from '../../../nats-client';
import { TicketUpdatedEvent } from '@jagittix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import TicketUpdatedListener from '../ticket-updated-listener';

const setup = async () => {
    const listener = new TicketUpdatedListener(nats.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'updated',
        price: 22,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
};

it('update a ticket', async () => {
    const { listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('out of order event', async () => {
    const { listener, data, msg, ticket } = await setup();
    data.version++;

    await expect(async () => {
        await listener.onMessage(data, msg);
    }).rejects.toThrow();

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(ticket.title);
    expect(updatedTicket!.price).toEqual(ticket.price);
    expect(updatedTicket!.version).toEqual(ticket.version);

    expect(msg.ack).not.toHaveBeenCalled();
});

it('ack the msg', async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    await Ticket.findById(ticket.id);
    expect(msg.ack).toHaveBeenCalled();
});
