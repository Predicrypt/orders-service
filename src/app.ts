import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import { currentUser } from '@Predicrypt/common';
import { ordersRoute } from './routes/orderRoutes';


const app = express();

app.use(cors());
app.use(json());
app.use(currentUser)
app.use(ordersRoute)


if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

export default app;
