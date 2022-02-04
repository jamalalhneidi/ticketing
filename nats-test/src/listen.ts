console.clear();
import TicketCreatedListener from './ticket-created-listener';
import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

stan.on('connect', () => {
    console.log('Listener Connected');

    stan.on('close', () => {
        console.log('Connection closed');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});
