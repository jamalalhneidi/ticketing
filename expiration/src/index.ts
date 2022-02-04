import nats from './nats-client';
import OrderCreatedListener from './events/listeners/order-created-listener';

const start = async () => {
    const { NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID } = process.env;
    if (!NATS_CLIENT_ID || !NATS_URL || !NATS_CLUSTER_ID)
        throw new Error('ENV VARS missing');

    await nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, { url: NATS_URL });
    nats.client.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    process.on('SIGINT', () => nats.client.close());
    process.on('SIGTERM', () => nats.client.close());

    new OrderCreatedListener(nats.client).listen();
};
start().catch((e) => {
    console.error(e);
});
