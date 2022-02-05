import mongoose from 'mongoose';
import app from './app';
import nats from './nats-client';
import TicketCreatedListener from './events/listeners/ticket-created-listener';
import TicketUpdatedListener from './events/listeners/ticket-updated-listener';
import OrderExpiredListener from './events/listeners/order-expired-listener';
import PaymentCreatedListener from './events/listeners/payment-created-listener';

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

    new TicketCreatedListener(nats.client).listen();
    new TicketUpdatedListener(nats.client).listen();
    new OrderExpiredListener(nats.client).listen();
    new PaymentCreatedListener(nats.client).listen();

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};

start().catch((e) => {
    console.error(e);
});
