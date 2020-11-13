import { Subject, Publisher, ExpirationCompleteEvent } from '@oscar-ticketingdev/common';

export class ExpirationCompletePubliser extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subject.ExpirationComplete;
    
}
