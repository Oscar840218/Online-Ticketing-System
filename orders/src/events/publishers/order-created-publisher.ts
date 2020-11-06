import { Publisher, OrderCreatedEvent, Subject } from '@oscar-ticketingdev/common';

export class OrderCreatedPubliser extends Publisher<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;

}
