import { Request, Response } from 'express';
import { supabase } from '../config/db';

export const submitApplication = async (req: Request, res: Response) => {
  try {
    const { job_id, cover_letter } = req.body;
    const jobSeekerId = req.user?.id;

    if (!jobSeekerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id,
        job_seeker_id: jobSeekerId,
        cover_letter,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // First get the application to check permissions
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('jobs(employer_id)')
      .eq('id', id)
      .single();

    if (appError) throw appError;

    // Verify the requesting user is the employer who owns the job
    if (req.user?.id !== application.jobs.employer_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};