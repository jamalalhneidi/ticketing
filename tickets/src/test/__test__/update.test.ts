import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
import nats from '../../nats-client';
import { routes } from '../../router';

const createTicket = async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({ title: 'TITLE', price: 3, userId });
    await ticket.save();
    return ticket;
};

it('401 not signed in', async () => {
    const ticket = await createTicket();
    await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            title: 'title',
            price: 2,
        })
        .expect(401);
});

it('400 no body fields', async () => {
    const ticket = await createTicket();
    await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            // title: 'title',
            // price: 2
        })
        .set('Cookie', global.signin(ticket.userId))
        .expect(400);
});

it('403 updating a ticket owned by another', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = await createTicket();
    await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            title: 'title',
            price: 2,
        })
        .set('Cookie', global.signin(userId))
        .expect(403);
});

it('404 ticket not found', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .patch(routes.update.replace(':id', ticketId))
        .send({
            title: 'title',
            price: 2,
        })
        .set('Cookie', global.signin())
        .expect(404);
});

it('200 update successful', async () => {
    const ticket = await createTicket();
    const res = await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            title: 'updated',
            price: 556,
        })
        .set('Cookie', global.signin(ticket.userId))
        .expect(200);
    expect(res.body.ticket).toBeDefined();
    expect(res.body.ticket).toHaveProperty('id', ticket.id);
    expect(res.body.ticket).toHaveProperty('title', 'updated');
    expect(res.body.ticket).toHaveProperty('price', 556);
    expect(res.body.ticket).toHaveProperty('userId', ticket.userId);

    const res2 = await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            // title: 'title',
            price: 22,
        })
        .set('Cookie', global.signin(ticket.userId))
        .expect(200);
    expect(res2.body.ticket.price).toEqual(22);
    expect(res2.body.ticket.title).toEqual('updated');

    const res3 = await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            title: 'title',
            // price: 2
        })
        .set('Cookie', global.signin(ticket.userId))
        .expect(200);
    expect(res3.body.ticket.price).toEqual(22);
    expect(res3.body.ticket.title).toEqual('title');

    expect(nats.client.publish).toHaveBeenCalledTimes(3);
});

it('400 no body fields', async () => {
    const ticket = await createTicket();
    ticket.orderId = new mongoose.Types.ObjectId().toHexString();
    await ticket.save();

    await request(app)
        .patch(routes.update.replace(':id', ticket.id))
        .send({
            title: 'title',
            // price: 2
        })
        .set('Cookie', global.signin(ticket.userId))
        .expect(400);
});
