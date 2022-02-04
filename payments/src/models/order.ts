import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@jagittix/common';

interface OrderAttributes {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface Statics extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttributes): OrderDoc;
    findByIdVersioned(event: {
        id: string;
        version: number;
    }): Promise<OrderDoc | null>;
}

const schema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
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

schema.statics.build = (attrs: OrderAttributes) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};

schema.statics.findByIdVersioned = (event: { id: string; version: number }) =>
    Order.findOne({
        _id: event.id,
        version: event.version - 1,
    });

const Order = mongoose.model<OrderDoc, Statics>('Order', schema);

export default Order;
