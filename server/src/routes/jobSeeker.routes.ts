import { Router } from 'express';
import { 
  getJobSeekerProfile, 
  updateJobSeekerProfile, 
  getJobSeekerApplications 
} from '../controllers/jobSeeker.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', authenticate, getJobSeekerProfile);
router.put('/:id', authenticate, updateJobSeekerProfile);
router.get('/:id/applications', authenticate, getJobSeekerApplications);

export default router;