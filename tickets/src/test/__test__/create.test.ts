import request from 'supertest';
import app from '../../app';
import { routes } from '../../router';
import nats from '../../nats-client';

it('routes.create', async () => {
    const cookie = signin();
    const res = await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 10,
        })
        .expect(201);
    expect(res.body.ticket.id).toBeDefined();
    expect(res.body.ticket.userId).toBeDefined();
    expect(res.body.ticket.title).toEqual('title');
    expect(res.body.ticket.price).toEqual(10);
});

it('publishes an event', async () => {
    const res = await request(app)
        .post(routes.create)
        .set('Cookie', signin())
        .send({
            title: 'title',
            price: 10,
        })
        .expect(201);
    expect(nats.client.publish).toHaveBeenCalled();
});
