import { Publisher, Subject, TicketUpdatedEvent } from '@oscar-ticketingdev/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated
}