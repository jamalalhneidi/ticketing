import express from 'express';
import * as validator from './validator';
import * as controller from './controller';
import { requireAuth } from '@jagittix/common';
const router = express.Router();
export const routes = {
    list: '/api/tickets',
    get: '/api/tickets/:id',
    create: '/api/tickets',
    update: '/api/tickets/:id',
};

router.get(routes.list, controller.list);

router.use(requireAuth);

router.get(routes.get, validator.get, controller.get);

router.post(routes.create, validator.create, controller.create);

router.patch(routes.update, validator.update, controller.update);

export default router;
