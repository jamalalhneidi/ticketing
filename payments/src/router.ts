import express from 'express';
import * as validator from './validator';
import * as controller from './controller';
import { requireAuth } from '@jagittix/common';
const router = express.Router();
export const routes = {
    create: '/api/payments',
};

router.use(requireAuth);

router.post(routes.create, validator.create, controller.create);

export default router;
