import { Subject, Publisher, PaymentCreatedEvent } from '@oscar-ticketingdev/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subject.PaymentCreated;
    
}