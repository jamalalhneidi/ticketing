import request from 'supertest';
import app from '../../app';
import { routes } from '../../router';

it('list tickets', async () => {
    const res = await request(app).get(routes.list).expect(200);
    expect(res.body.tickets).toBeDefined();
    expect(res.body.tickets).toBeInstanceOf(Array);
});
