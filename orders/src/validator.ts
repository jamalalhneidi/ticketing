import { generateExpressValidator } from '@jagittix/common';
import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const get = generateExpressValidator({
    params: {
        id: Joi.string()
            .trim()
            // we could skip the ObjectId validator Cuz we don't wanna assume that the ticket id is always gonna be
            // a mongo ObjectId
            .custom((value) => {
                if (!isValidObjectId(value)) throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
});

export const create = generateExpressValidator({
    body: {
        ticketId: Joi.string()
            .trim()
            // we could skip the ObjectId validator Cuz we don't wanna assume that the ticket id is always gonna be
            // a mongo ObjectId
            .custom((value) => {
                if (!isValidObjectId(value)) throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
});

export const cancel = generateExpressValidator({
    params: {
        id: Joi.string()
            .trim()
            .custom((value) => {
                if (!isValidObjectId(value)) throw new Error('it is invalid');
                return value;
            })
            .required(),
    },
});
