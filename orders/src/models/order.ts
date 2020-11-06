import { OrderStatus } from '@oscar-ticketingdev/common';
import mongoose from 'mongoose';
import { TicketDocs } from './ticket'

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocs;
}

interface OrderDocs extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocs;
}

interface OrderModel extends mongoose.Model<OrderDocs> {
  build(attrs: OrderAttrs): OrderDocs;
}

const OrderSchema = new mongoose.Schema({
  userId: {
      type: String,
      required: true
  },
  status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
  },
  expiresAt: {
      type: mongoose.Schema.Types.Date
  },
  ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ticket'
  }
}, {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
});

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
};

const Order = mongoose.model<OrderDocs, OrderModel>('Order', OrderSchema);

export { Order }