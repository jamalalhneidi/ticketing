import { OrderStatus } from '@jagittix/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Order from '../../models/order';
import Ticket from '../../models/ticket';
import { routes } from '../../router';

it('404 order not found', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(routes.get.replace(':id', userId))
        .set('Cookie', global.signin(userId))
        .expect(404);
});

it('403 unauthorized', async () => {
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
        .get(routes.get.replace(':id', order.id))
        .set('Cookie', global.signin())
        .expect(403);
});

it('200 success', async () => {
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
        .get(routes.get.replace(':id', userId))
        .set('Cookie', global.signin(userId))
        .expect(404);
});
