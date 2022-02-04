import express from 'express';
import 'express-async-errors';
import router from './router';
import { globalErrorHandler } from '@jagittix/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);
app.use(router);

app.use(globalErrorHandler);

export default app;
