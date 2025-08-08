import { supabase } from '../config/db';
import { ApplicationStatus } from '../types/custom';

export const ApplicationModel = {
  async create(applicationData: {
    job_id: string;
    job_seeker_id: string;
    cover_letter?: string;
  }) {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: ApplicationStatus) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByJobSeeker(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('job_seeker_id', jobSeekerId);

    if (error) throw error;
    return data;
  },

  async findByJob(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job_seekers(profiles(first_name, last_name, avatar_url))')
      .eq('job_id', jobId);

    if (error) throw error;
    return data;
  }
};