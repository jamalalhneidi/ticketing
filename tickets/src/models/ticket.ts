import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
}

export interface Doc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
    version: number;
}

interface Statics extends mongoose.Model<Doc> {
    build(attributes: TicketAttributes): Doc;
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
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
    },
    {
        toJSON: {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attributes: TicketAttributes) => new Ticket(attributes);

const Ticket = mongoose.model<Doc, Statics>('Ticket', schema);

export default Ticket;
