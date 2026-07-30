import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

// Admin Order routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;