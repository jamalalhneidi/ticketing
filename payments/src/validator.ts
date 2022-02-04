import { generateExpressValidator } from '@jagittix/common';
import Joi from 'joi';
import mongoose from 'mongoose';

export const create = generateExpressValidator({
    body: {
        token: Joi.string().token().required(),
        orderId: Joi.string()
            .trim()
            .custom((value) => {
                if (!mongoose.isValidObjectId(value))
                    throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
});
