import { Request, Response } from 'express';
import Order from './models/order';
import { Exception, OrderStatus } from '@jagittix/common';
import stripe from './stripe';
import Payment from './models/payment';
import PaymentCreatedPublisher from './events/publishers/payment-created-publisher';
import nats from './nats-client';

export const create = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new Exception(404, 'Order not found');
    if (order.status === OrderStatus.Cancelled)
        throw new Exception(400, `Order is already ${order.status}`);
    if (order.userId !== req.user.id) throw new Exception(403, 'Unauthorized');

    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: 'eur',
        source: token,
    });

    const payment = Payment.build({ orderId, chargeId: charge.id });
    await payment.save();

    await new PaymentCreatedPublisher(nats.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        chargeId: payment.chargeId,
    });

    res.status(201).send({ payment: { id: payment.id } });
};
