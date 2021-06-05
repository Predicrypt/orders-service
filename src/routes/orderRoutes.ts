import { requireAuth } from '@Predicrypt/common';
import { Router } from 'express';
import {
  cancelOrder,
  getActiveOrders,
  makeOrder,
} from '../controllers/ordersController';

const router = Router();

router.post('/orders/spot', requireAuth, makeOrder);
router.delete('/orders/spot', requireAuth, cancelOrder);
router.get('/orders/spot', requireAuth, getActiveOrders);

export { router as ordersRoute };
