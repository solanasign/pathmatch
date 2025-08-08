import { Router } from 'express';
import { 
  getAllJobs, 
  getJobDetails, 
  createJob 
} from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllJobs);
router.get('/:id', getJobDetails);
router.post('/', authenticate, createJob);

export default router;