import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
let mongo: MongoMemoryServer;

declare global {
    var signin: (id?: string) => string[];
}
jest.mock('../nats-client');

beforeAll(async () => {
    process.env.JWT_KEY = 'shit';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
    // await nats.connect('ticketing', 'tickets', { url: 'http://nats-srv:4222' });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    await Promise.all(
        collections.map((collection) => collection.deleteMany({}))
    );
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'shit@shit.com',
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    return [`session=${base64}`];
};
