import { Request, Response } from 'express';
import { supabase } from '../config/db';

export const getEmployerProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('employers')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateEmployerProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify user owns this profile
    if (req.user?.id !== id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    // Update employer profile
    const { data, error } = await supabase
      .from('employers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployerJobs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify user owns this profile
    if (req.user?.id !== id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', id);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { id, jobId } = req.params;

    // Verify user owns this profile
    if (req.user?.id !== id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*, job_seekers(profiles(first_name, last_name, avatar_url))')
      .eq('job_id', jobId);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};