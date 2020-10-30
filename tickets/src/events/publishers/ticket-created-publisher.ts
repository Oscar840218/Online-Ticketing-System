import { Publisher, Subject, TicketCreatedEvent } from '@oscar-ticketingdev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated
}