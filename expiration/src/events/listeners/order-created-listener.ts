import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subject } from '@oscar-ticketingdev/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

      await expirationQueue.add({ 
        orderId: data.id 
      }, {
        delay: delay
      });

      msg.ack();
    }
}