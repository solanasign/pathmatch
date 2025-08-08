import { supabase } from '../config/db';

export const JobSeekerModel = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('job_seekers')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from('job_seekers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApplications(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('job_seeker_id', jobSeekerId);

    if (error) throw error;
    return data;
  }
};