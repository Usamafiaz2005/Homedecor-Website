import { Router } from 'express';
import { register, login, logout, refresh, getMe, getUsers, updateUserRole } from '../controllers/auth.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { registerSchema } from '../validators/auth.validator';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

// Admin Customer Management
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

export default router;