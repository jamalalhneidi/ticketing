import OrderExpiredListener from '../order-expired-listener';
import nats from '../../../nats-client';
import Ticket from '../../../models/ticket';
import Order from '../../../models/order';
import { OrderExpiredEvent, OrderStatus } from '@jagittix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderExpiredListener(nats.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
    });
    await order.save();

    const data: OrderExpiredEvent['data'] = {
        id: order.id,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, order, ticket, data, msg };
};

it('marks order as cancelled', async () => {
    const { listener, order, msg, data } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes order cancelled event', async () => {
    const { listener, order, msg, data } = await setup();
    await listener.onMessage(data, msg);

    expect(nats.client.publish).toHaveBeenCalled();
});

it('acks the msg', async () => {
    const { listener, order, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
