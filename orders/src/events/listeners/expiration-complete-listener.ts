import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, ExpirationCompleteEvent, Subject, OrderStatus } from '@oscar-ticketingdev/common';
import { Order } from '../../models/order';
import { OrderCancelledPubliser } from './../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status == OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled
    });

    await order.save();

    await new OrderCancelledPubliser(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
          id: order.ticket.id
      }
    });

    msg.ack();
  }
}
