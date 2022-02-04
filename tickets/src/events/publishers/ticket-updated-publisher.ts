import { Publisher, Subjects, TicketUpdatedEvent } from '@jagittix/common';

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
