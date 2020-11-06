import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subject, Listener, TicketCreatedEvent } from '@oscar-ticketingdev/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.build({
        id,
        title, 
        price
    });
    await ticket.save();

    msg.ack();
  }
}