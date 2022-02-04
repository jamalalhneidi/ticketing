import TicketCreatedPublisher from './ticket-created-publisher';

console.clear();
import { randomBytes } from 'crypto';
import * as nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log('Publisher Connected');
    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: randomBytes(4).toString('hex'),
            title: 'title',
            price: +(Math.random() * 10).toFixed(0),
        });
    } catch (err) {
        console.error(err);
    }
});
