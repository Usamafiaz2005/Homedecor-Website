import { Router } from 'express';
import { getDashboardStats } from '../controllers/analytics.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
router.get('/dashboard', protect, adminOnly, getDashboardStats);
export default router;