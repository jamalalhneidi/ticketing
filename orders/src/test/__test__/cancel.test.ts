import { OrderStatus } from '@jagittix/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Order from '../../models/order';
import Ticket from '../../models/ticket';
import nats from '../../nats-client';
import { routes } from '../../router';

it('204 order marked as cancelled', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        ticket,
        expiresAt: new Date(),
        userId,
        status: OrderStatus.Created,
    });
    await order.save();
    await request(app)
        .delete(routes.cancel.replace(':id', order.id))
        .set('Cookie', global.signin(userId))
        .expect(204);

    const res = await request(app)
        .get(routes.get.replace(':id', order.id))
        .set('Cookie', global.signin(userId))
        .expect(200);
    expect(res.body.order.status).toEqual(OrderStatus.Cancelled);
});

it('emit cancel event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        ticket,
        expiresAt: new Date(),
        userId,
        status: OrderStatus.Created,
    });
    await order.save();
    await request(app)
        .delete(routes.cancel.replace(':id', order.id))
        .set('Cookie', global.signin(userId));

    expect(nats.client.publish).toHaveBeenCalled();
});
