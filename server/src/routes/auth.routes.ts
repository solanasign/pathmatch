import { Router } from 'express';
import { register, login, getCurrentUser, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', login);

// Protected routes
// @ts-ignore
router.get('/me', authenticate, getCurrentUser);
// @ts-ignore
router.post('/refresh', authenticate, refreshToken);

export default router;