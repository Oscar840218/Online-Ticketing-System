import { Publisher, OrderCancelledEvent, Subject } from '@oscar-ticketingdev/common';

export class OrderCancelledPubliser extends Publisher<OrderCancelledEvent> {
    readonly subject = Subject.OrderCancelled;

}
