import mongoose from 'mongoose';
import Order from './order';
import { OrderStatus } from '@jagittix/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    id: string;
    title: string;
    price: number;
    version: number;
    isReserved(): boolean;
}

interface Statics extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc;

    findByIdVersioned(event: {
        id: string;
        version: number;
    }): Promise<TicketDoc | null>;
}

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
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

schema.statics.build = (attributes: TicketAttributes) =>
    new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price,
    });

schema.statics.findByIdVersioned = (event: { id: string; version: number }) =>
    Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });

schema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Pending,
                OrderStatus.Completed,
            ],
        },
    });
    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, Statics>('Ticket', schema);
export default Ticket;
