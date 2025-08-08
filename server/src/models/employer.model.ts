import { supabase } from '../config/db';

export const EmployerModel = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('employers')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from('employers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getJobs(employerId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId);

    if (error) throw error;
    return data;
  },

  async getJobApplications(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job_seekers(profiles(first_name, last_name, avatar_url))')
      .eq('job_id', jobId);

    if (error) throw error;
    return data;
  }
};