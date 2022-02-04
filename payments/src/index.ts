import mongoose from 'mongoose';
import app from './app';
import nats from './nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const PORT = 3000;

const start = async () => {
    const { JWT_KEY, MONGO_URI, NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID } =
        process.env;
    if (
        !JWT_KEY ||
        !MONGO_URI ||
        !NATS_CLIENT_ID ||
        !NATS_URL ||
        !NATS_CLUSTER_ID
    )
        throw new Error('ENV VARS missing');

    await mongoose.connect(MONGO_URI);
    console.log(
        `Connected to ${MONGO_URI.substring(
            MONGO_URI.indexOf('//') + 2,
            MONGO_URI.indexOf('27017') - 1
        )} DB`
    );

    await nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, { url: NATS_URL });
    nats.client.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    process.on('SIGINT', () => nats.client.close());
    process.on('SIGTERM', () => nats.client.close());

    new OrderCreatedListener(nats.client).listen();
    new OrderCancelledListener(nats.client).listen();

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};
start().catch((e) => {
    console.error(e);
});
