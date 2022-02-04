import { generateExpressValidator } from '@jagittix/common';
import Joi from 'joi';

export const signUp = generateExpressValidator({
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
    },
});

export const signIn = generateExpressValidator({
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
    },
});
