import { Publisher, Subjects, TicketCreatedEvent } from '@jagittix/common';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
