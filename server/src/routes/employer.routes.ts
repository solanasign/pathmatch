import { Router } from 'express';
import { 
  getEmployerProfile, 
  updateEmployerProfile, 
  getEmployerJobs,
  getJobApplications
} from '../controllers/employer.controller';
import { authenticate, requireEmployerOrAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (employers only)
// More specific routes first
// @ts-ignore
router.get('/:id/jobs/:jobId/applications', authenticate, requireEmployerOrAdmin, getJobApplications);
// @ts-ignore
router.get('/:id/jobs', authenticate, requireEmployerOrAdmin, getEmployerJobs);
// General routes last
// @ts-ignore
router.get('/:id', authenticate, requireEmployerOrAdmin, getEmployerProfile);
// @ts-ignore
router.put('/:id', authenticate, requireEmployerOrAdmin, updateEmployerProfile);

export default router;