import express from 'express';
import * as controller from './controller';
import * as validator from './validator';
import { requireAuth } from '@jagittix/common';
const router = express.Router();

router.post('/api/users/signup', validator.signUp, controller.signUp);
router.post('/api/users/signin', validator.signIn, controller.signIn);

router.use(requireAuth);

router.get('/api/users/current-user', controller.currentUser);
router.post('/api/users/signout', controller.signOut);

export default router;
