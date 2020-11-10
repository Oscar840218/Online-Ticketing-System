import express, { Response, Request } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@oscar-ticketingdev/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPubliser } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPubliser(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    },
    version: order.version
  })

  res.status(204).send(order);
});

export { router as DeleteOrderRouter };