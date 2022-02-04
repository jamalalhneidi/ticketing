import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentAttributes {
    orderId: string;
    chargeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    chargeId: string;
}

interface Statics extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttributes): PaymentDoc;
}

const schema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        chargeId: {
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

schema.statics.build = (attrs: PaymentAttributes) => {
    return new Payment(attrs);
};

schema.statics.findByIdVersioned = (event: { id: string; version: number }) =>
    Payment.findOne({
        _id: event.id,
        version: event.version - 1,
    });

const Payment = mongoose.model<PaymentDoc, Statics>('Payment', schema);

export default Payment;
