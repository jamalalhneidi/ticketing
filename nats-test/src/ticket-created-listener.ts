import { Listener } from '../../common/src/nats/listener';
import { Message } from 'node-nats-streaming';
import { Subjects } from '../../common/src/nats/events/subjects';
import { TicketCreatedEvent } from '../../common/src/nats/events/ticket-created-event';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly qGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log(data);
        msg.ack();
    }
}
