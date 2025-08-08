import { Request, Response } from 'express';
import { supabase } from '../config/db';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { type, location, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from('jobs')
      .select('*, employers(profiles(first_name, last_name, avatar_url))')
      .eq('is_active', true)
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (type) query = query.eq('job_type', type);
    if (location) query = query.ilike('location', `%${location}%`);

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('jobs')
      .select('*, employers(profiles(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, responsibilities, job_type, location, salary_range } = req.body;
    const employerId = req.user?.id;

    if (!employerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        employer_id: employerId,
        title,
        description,
        requirements,
        responsibilities,
        job_type,
        location,
        salary_range,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};