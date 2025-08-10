import { Router } from 'express';
import { 
  getAllJobs, 
  getJobDetails, 
  createJob
} from '../controllers/job.controller';
import { authenticate, requireEmployerOrAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
// @ts-ignore
router.get('/', getAllJobs);
// @ts-ignore
router.get('/:id', getJobDetails);

// Protected routes (employers only)
// @ts-ignore
router.post('/', authenticate, requireEmployerOrAdmin, createJob);

export default router;