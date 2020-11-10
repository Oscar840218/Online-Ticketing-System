import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Listener, OrderCreatedEvent, Subject } from '@oscar-ticketingdev/common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from './../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      // Find the ticket that order is reserving
      const ticket = await Ticket.findById(data.ticket.id);

      // If no ticket throw error
      if (!ticket) {
          throw new Error('Ticket not found');
      }

      // Mark ticket has been reserved by setting its order id
      ticket.set({ orderId: data.id });

      // Save the ticket
      await ticket.save();
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version
      });

      // ack the message
      msg.ack();
    }
}