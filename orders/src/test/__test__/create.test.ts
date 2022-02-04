import request from 'supertest';
import Ticket from '../../models/ticket';
import mongoose from 'mongoose';
import app from '../../app';
import { routes } from '../../router';
import Order from '../../models/order';
import { OrderStatus } from '@jagittix/common';
import nats from '../../nats-client';

it('401 unauthenticated', async () => {
    await request(app)
        .post(routes.create)
        .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
        .expect(401);
});

it('404 ticket doesnt exist', async () => {
    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
        .expect(404);
});

it('400 missing or invalid ticketId', async () => {
    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        // .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
        .expect(400);
    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        .send({ ticketId: 'new mongoose.Types.ObjectId().toHexString()' })
        .expect(400);
});

it('400 ticket already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();
    const userId = new mongoose.Types.ObjectId();
    const order = Order.build({
        userId: userId.toHexString(),
        ticket,
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('201 ticket successfully reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it('emit created event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'title',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post(routes.create)
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id });

    expect(nats.client.publish).toHaveBeenCalled();
});
