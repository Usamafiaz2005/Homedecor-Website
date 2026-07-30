import { Router } from 'express';
import { initiateJazzCash } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.post('/jazzcash/:id', protect, initiateJazzCash);
export default router;