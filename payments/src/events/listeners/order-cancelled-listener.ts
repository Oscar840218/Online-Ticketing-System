import { Message } from 'node-nats-streaming';
import { Listener, Subject, OrderCancelledEvent, OrderStatus } from '@oscar-ticketingdev/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version-1
    });

    if (!order) {
        throw new Error('OrderNotFound');
    }

    order.set({status: OrderStatus.Cancelled});

    await order.save();

    msg.ack();
  }
}
