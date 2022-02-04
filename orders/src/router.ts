import express from 'express';
import * as validator from './validator';
import * as controller from './controller';
import { requireAuth } from '@jagittix/common';
const router = express.Router();
export const routes = {
    get: '/api/orders/:id',
    list: '/api/orders',
    create: '/api/orders',
    cancel: '/api/orders/:id',
};

router.use(requireAuth);

router.get(routes.list, controller.list);
router.get(routes.get, validator.get, controller.get);

router.post(routes.create, validator.create, controller.create);
router.delete(routes.cancel, validator.cancel, controller.cancel);

export default router;
