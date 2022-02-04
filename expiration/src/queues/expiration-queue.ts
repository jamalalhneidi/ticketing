import Queue from 'bull';
import OrderExpiredPublisher from '../events/publishers/order-expired-publisher';
import nats from '../nats-client';

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

expirationQueue.process(async (job) => {
    console.log(`Order [${job.data.orderId}] expired`);
    await new OrderExpiredPublisher(nats.client).publish({
        id: job.data.orderId,
    });
});

export default expirationQueue;
