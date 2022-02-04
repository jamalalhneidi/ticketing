import request from 'supertest';
import Ticket from '../../models/ticket';
import mongoose from 'mongoose';
import app from '../../app';
import { routes } from '../../router';
import Order from '../../models/order';
import { OrderStatus } from '@jagittix/common';

it('200', async () => {
    const expiresAt = new Date();
    const status = OrderStatus.Created;
    const user1Id = new mongoose.Types.ObjectId();
    const user1Orders = 3;
    const user2Id = new mongoose.Types.ObjectId();
    const user2Orders = 1;
    for (let i = 0; i < user1Orders; i++) {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'shit',
            price: 234,
        });
        await ticket.save();

        const order = Order.build({
            ticket,
            expiresAt,
            status,
            userId: user1Id.toHexString(),
        });
        await order.save();
    }

    for (let i = 0; i < user2Orders; i++) {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'shit',
            price: 234,
        });
        await ticket.save();

        const order = Order.build({
            ticket,
            expiresAt,
            status,
            userId: user2Id.toHexString(),
        });
        await order.save();
    }

    const res = await request(app)
        .get(routes.list)
        .set('Cookie', global.signin(user1Id.toHexString()))
        .expect(200);
    console.log(JSON.stringify(res.body, null, 4));
    expect(res.body.orders).toBeInstanceOf(Array);
    expect(res.body.orders).toHaveLength(user1Orders);
});
