import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler } from '@Predicrypt/common';
import { ordersRoute } from './routes/orderRoutes';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    httpOnly: false,
    sameSite: 'none',
  })
);

app.use(currentUser);
app.use(ordersRoute);

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(errorHandler);
export default app;
