import { Request, Response } from 'express';
import Ticket from './models/ticket';
import { Exception } from '@jagittix/common';
import TicketCreatedPublisher from './events/publishers/ticket-created-publisher';
import nats from './nats-client';
import TicketUpdatedPublisher from './events/publishers/ticket-updated-publisher';

export const get = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new Exception(404, 'Ticket not found');
    res.status(200).send({ ticket });
};

export const list = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({ orderId: undefined });
    res.status(200).send({ tickets });
};

export const create = async (req: Request, res: Response) => {
    const { id } = req.user;
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: id });
    await ticket.save();
    await new TicketCreatedPublisher(nats.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.status(201).send({ ticket });
};

export const update = async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id: ticketId } = req.params;
    const { title, price } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Exception(404, 'Ticket not found');
    if (ticket.orderId) throw new Exception(400, 'Ticket is reserved');
    if (ticket.userId !== userId) throw new Exception(403, 'Unauthorized');
    ticket.title = title || ticket.title;
    ticket.price = price || ticket.price;
    await ticket.save();
    new TicketUpdatedPublisher(nats.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.status(200).send({ ticket });
};
