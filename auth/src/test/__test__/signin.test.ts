import request from 'supertest';
import app from '../../app';

it('400 invalid', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'shit@shit.com',
            password: 'shit',
        })
        .expect(400);
});
