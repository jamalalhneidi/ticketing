import Publisher from '../../common/src/nats/publisher';
import TicketCreatedEvent from '../../common/src/nats/events/ticket-created-event';
import Subjects from '../../common/src/nats/events/subjects';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

};