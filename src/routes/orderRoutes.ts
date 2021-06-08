import { requireAuth } from '@Predicrypt/common';
import { Router } from 'express';
import {
  cancelOrder,
  getActiveOrders,
  makeOrder,
} from '../controllers/ordersController';

const router = Router();

router.post('/api/orders/spot', requireAuth, makeOrder);
router.delete('/api/orders/spot', requireAuth, cancelOrder);
router.get('/api/orders/spot', requireAuth, getActiveOrders);

export { router as ordersRoute };
