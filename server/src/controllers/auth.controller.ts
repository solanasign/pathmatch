import { Request, Response } from 'express';
import { supabase } from '../config/db';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authData.user?.id,
        role,
        first_name: firstName,
        last_name: lastName,
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    // Create role-specific profile
    if (role === 'job_seeker') {
      await supabase
        .from('job_seekers')
        .insert([{ id: profileData.id }]);
    } else if (role === 'employer') {
      await supabase
        .from('employers')
        .insert([{ id: profileData.id }]);
    }

    res.status(201).json(profileData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) throw profileError;

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: profile,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    res.json(profile);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};