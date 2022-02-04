import request from 'supertest';
import app from '../../app';

it('200 current user', async () => {
    const cookie = await signup();
    const res = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200);
    console.log(res.body);
});
