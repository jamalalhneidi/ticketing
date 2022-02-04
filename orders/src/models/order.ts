import mongoose from 'mongoose';
import { OrderStatus } from '@jagittix/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    version: number;
    ticket: TicketDoc;
}

interface Statics extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc;
}

const schema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attributes: OrderAttributes) => new Order(attributes);

const Order = mongoose.model<OrderDoc, Statics>('Order', schema);
export default Order;
