import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
let mongo: MongoMemoryServer;

declare global {
    var signup: () => Promise<string[]>;
}

beforeAll(async () => {
    process.env.JWT_KEY = 'shit';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(
        collections.map((collection) => collection.deleteMany({}))
    );
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

global.signup = async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'shit@shit.com',
            password: 'shit',
        })
        .expect(201);
    return res.get('Set-Cookie');
};
