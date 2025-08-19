import { Router } from 'express';
import { 
  getJobSeekerProfile, 
  updateJobSeekerProfile, 
  getJobSeekerApplications 
} from '../controllers/jobSeeker.controller';
import { authenticate, requireJobSeeker } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (job seekers only)
// @ts-ignore
router.get('/:id', authenticate, requireJobSeeker, getJobSeekerProfile);
// @ts-ignore
router.put('/:id', authenticate, requireJobSeeker, updateJobSeekerProfile);
// @ts-ignore
router.get('/:id/applications', authenticate, requireJobSeeker, getJobSeekerApplications);

export default router;