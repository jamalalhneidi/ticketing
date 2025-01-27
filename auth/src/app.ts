import { globalErrorHandler } from '@jagittix/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import router from './router';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);
app.use(router);

app.use(globalErrorHandler);

export default app;
