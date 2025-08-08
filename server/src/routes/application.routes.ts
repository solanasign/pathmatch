import { Router } from 'express';
import { 
  submitApplication, 
  updateApplicationStatus 
} from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, submitApplication);
router.put('/:id/status', authenticate, updateApplicationStatus);

export default router;