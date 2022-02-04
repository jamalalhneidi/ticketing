import OrderCreatedListener from '../order-created-listener';
import nats from '../../../nats-client';
import Ticket from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderStatus } from '@jagittix/common/build/nats/events/types/order-status';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderCreatedListener(nats.client);
    const ticket = Ticket.build({
        title: 'title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const data = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, ticket, msg };
};

it('reserve a ticket', async () => {
    const { listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
    expect(updatedTicket!.version).toEqual(ticket.version + 1);
});

it('ack the msg', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publish ticket updated event', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(nats.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (nats.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
