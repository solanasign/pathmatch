import { Router } from 'express';
import { register, login, getCurrentUser, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


router.post('/register', register);

router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);

router.post('/refresh', authenticate, refreshToken);

export default router;