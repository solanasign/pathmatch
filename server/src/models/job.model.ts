import { supabase } from '../config/db';
import { JobType } from '../types/custom';

export const JobModel = {
  async create(jobData: {
    employer_id: string;
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    job_type: JobType;
    location?: string;
    salary_range?: string;
  }) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(filters: {
    type?: JobType;
    location?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('jobs')
      .select('*, employers(profiles(first_name, last_name, avatar_url))')
      .eq('is_active', true);

    if (filters.type) query = query.eq('job_type', filters.type);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    if (filters.limit && filters.offset) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employers(profiles(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};