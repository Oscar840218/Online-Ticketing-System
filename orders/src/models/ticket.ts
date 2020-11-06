import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';


interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocs extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocs> {
  build(attrs: TicketAttrs): TicketDocs;
}

const TicketSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true,
      min: 0
  }
}, {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
});

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price
    });
}

TicketSchema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket', TicketSchema);

export { Ticket }