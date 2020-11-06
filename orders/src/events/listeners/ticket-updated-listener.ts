import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subject, Listener, TicketUpdatedEvent, NotFoundError } from '@oscar-ticketingdev/common';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version-1
    });

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    const { title, price } = data

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}