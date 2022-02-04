import { generateExpressValidator } from '@jagittix/common';
import Joi from 'joi';
import mongoose from 'mongoose';

export const get = generateExpressValidator({
    params: {
        id: Joi.string()
            .trim()
            .custom((value) => {
                if (!mongoose.isValidObjectId(value))
                    throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
});

export const create = generateExpressValidator({
    body: {
        title: Joi.string().trim().required(),
        price: Joi.number().positive().required(),
    },
});

export const update = generateExpressValidator({
    params: {
        id: Joi.string()
            .trim()
            .custom((value) => {
                if (!mongoose.isValidObjectId(value))
                    throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
    body: Joi.object({
        title: Joi.string().trim(),
        price: Joi.number().positive(),
    }).or('title', 'price'),
});
