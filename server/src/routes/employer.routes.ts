import { Router } from 'express';
import { 
  getEmployerProfile, 
  updateEmployerProfile, 
  getEmployerJobs,
  getJobApplications
} from '../controllers/employer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', authenticate, getEmployerProfile);
router.put('/:id', authenticate, updateEmployerProfile);
router.get('/:id/jobs', authenticate, getEmployerJobs);
router.get('/:id/jobs/:jobId/applications', authenticate, getJobApplications);

export default router;