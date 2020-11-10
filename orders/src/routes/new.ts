import express, { Response, Request } from 'express';
import { body } from 'express-validator'
import { requireAuth, validateRequest, NotFoundError, BadRequestError } from '@oscar-ticketingdev/common';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus} from '../models/order';
import { OrderCreatedPubliser } from './../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SERVICE = 15*60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must provided')
], async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  // find ticket is in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError
  }
  // Make sure the ticket is not reserved (conccuracy)
  //Run query to look at all orders
  const isReserved = ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved!')
  }
  //calculate expire date of the order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SERVICE);
  //build the order
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  //publish an event saying order is created
  new OrderCreatedPubliser(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    version: ticket.version
  })

  res.status(201).send(order);
});

export { router as NewOrderRouter };