import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
import { routes } from '../../router';

it('not found', async () => {
    await request(app)
        .get(
            routes.get.replace(
                ':id',
                new mongoose.Types.ObjectId().toHexString()
            )
        )
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns ticket if found', async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 10,
        userId: 'shsishihhfsif',
    });
    await ticket.save();
    await request(app)
        .get(routes.get.replace(':id', ticket.id))
        .set('Cookie', global.signin())
        .expect(200);
});
