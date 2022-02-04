import { Request, Response } from 'express';
import Ticket from './models/ticket';
import { Event, Exception, OrderStatus } from '@jagittix/common';
import Order from './models/order';
import moment from 'moment';
import OrderCreatedPublisher from './events/publishers/order-created-publisher';
import nats from './nats-client';
import OrderCancelledPublisher from './events/publishers/order-cancelled-publisher';

const ORDER_EXPIRATION_SECONDS = 1 * 60;

export const get = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) throw new Exception(404, 'Order not found');
    if (order.userId !== userId) throw new Exception(403, 'Unauthorized');

    res.status(200).send({ order });
};

export const list = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate('ticket');
    res.status(200).send({ orders });
};

export const create = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Exception(404, 'Ticket not found');

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new Exception(400, 'Ticket is already reserved');

    const expiresAt = moment().add(ORDER_EXPIRATION_SECONDS, 's').toDate();

    const order = Order.build({
        userId,
        status: OrderStatus.Created,
        expiresAt,
        ticket,
    });
    await order.save();

    new OrderCreatedPublisher(nats.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    });

    res.status(201).send({ order });
};

export const cancel = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) throw new Exception(404, 'Order not found');
    if (order.userId !== userId) throw new Exception(403, 'Unauthorized');

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(nats.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id },
    });

    res.status(204).send();
};
