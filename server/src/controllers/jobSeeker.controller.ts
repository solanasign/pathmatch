import { Request, Response } from 'express';
import { supabase } from '../config/db';

export const getJobSeekerProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('job_seekers')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateJobSeekerProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify user owns this profile
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update job seeker profile
    const { data, error } = await supabase
      .from('job_seekers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobSeekerApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify user owns this profile
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('job_seeker_id', id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};