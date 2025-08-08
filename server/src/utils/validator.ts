import { Request } from 'express';
import { ValidationError } from './errors';

export const validateRegisterInput = (req: Request) => {
  const { email, password, role, firstName, lastName } = req.body;

  if (!email || !password || !role || !firstName || !lastName) {
    throw new ValidationError('All fields are required');
  }

  if (!['job_seeker', 'employer'].includes(role)) {
    throw new ValidationError('Invalid role');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
};

export const validateJobInput = (req: Request) => {
  const { title, description, requirements, responsibilities, job_type } = req.body;

  if (!title || !description || !requirements || !responsibilities || !job_type) {
    throw new ValidationError('Missing required fields');
  }

  if (!Array.isArray(requirements) || !Array.isArray(responsibilities)) {
    throw new ValidationError('Requirements and responsibilities must be arrays');
  }
};

export const validateApplicationInput = (req: Request) => {
  const { job_id } = req.body;

  if (!job_id) {
    throw new ValidationError('Job ID is required');
  }
};