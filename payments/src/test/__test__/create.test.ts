import request from 'supertest';
import app from '../../app';
import { routes } from '../../router';
import mongoose from 'mongoose';
import Order from '../../models/order';
import { OrderStatus } from '@jagittix/common';
import stripe from '../../stripe';
import Payment from '../../models/payment';

jest.mock('../../stripe');

it('401 unauthenticated', async () => {
    await request(app).post(routes.create).send().expect(401);
});

it('400 missing body fields', async () => {
    const cookie = await global.signin();
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(400);
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'shit',
        })
        .expect(400);
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({})
        .expect(400);
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'shit',
            orderId: 'new mongoose.Types.ObjectId().toHexString()',
        })
        .expect(400);
});

it('404 order not found', async () => {
    const cookie = await global.signin();
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'shit',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('400 order cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin(userId);
    const order = await Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        userId,
        price: 20,
        version: 1,
    }).save();
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'shit',
            orderId: order.id,
        })
        .expect(400);
});

it('403 unauthorized', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin(userId);
    const order = await Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        version: 0,
    }).save();
    const res = await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'shit',
            orderId: order.id,
        })
        .expect(403);
});

it('201 success', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin(userId);
    const order = await Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId,
        price: 20,
        version: 0,
    }).save();
    await request(app)
        .post(routes.create)
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(stripe.charges.create).toHaveBeenCalled();
    expect(chargeOpts.amount).toEqual(order.price * 100);
    expect(chargeOpts.source).toEqual('tok_visa');
    expect(chargeOpts.currency).toEqual('eur');

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).not.toBeNull();
});
