import { Request, Response } from 'express';
import { supabase } from '../config/db';

const generateInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Email, password, role, first name, and last name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const validRoles = ['job_seeker', 'employer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either job_seeker or employer' 
      });
    }

    // Generate initials
    const initials = generateInitials(firstName.trim(), lastName.trim());

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return res.status(400).json({ 
        message: authError.message || 'Failed to create user account' 
      });
    }

    if (!authData.user) {
      return res.status(400).json({ 
        message: 'Failed to create user account' 
      });
    }

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authData.user.id,
        role,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        initials,
        email: email.toLowerCase().trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ 
        message: 'Failed to create user profile' 
      });
    }

    // Create role-specific profile
    try {
      if (role === 'job_seeker') {
        await supabase
          .from('job_seekers')
          .insert([{ 
            id: profileData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
      } else if (role === 'employer') {
        await supabase
          .from('employers')
          .insert([{ 
            id: profileData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
      }
    } catch (roleError) {
      console.error('Role-specific profile creation error:', roleError);
      // Continue without failing - role-specific profile can be created later
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        initials: profileData.initials,
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Internal server error during registration' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('Auth login error:', error);
      return res.status(401).json({ 
        message: error.message || 'Invalid email or password' 
      });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({ 
        message: 'Login failed' 
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return res.status(401).json({ 
        message: 'User profile not found' 
      });
    }

    // Ensure initials exist (for existing users who might not have them)
    if (!profile.initials && profile.first_name && profile.last_name) {
      const initials = generateInitials(profile.first_name, profile.last_name);
      await supabase
        .from('profiles')
        .update({ 
          initials,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      profile.initials = initials;
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        initials: profile.initials,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during login' 
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Use Supabase's token refresh functionality
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: token,
    });

    if (error || !data.session) {
      console.error('Token refresh error:', error);
      return res.status(401).json({ 
        message: 'Failed to refresh token' 
      });
    }

    // Get updated user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error during refresh:', profileError);
      return res.status(401).json({ 
        message: 'User profile not found' 
      });
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        initials: profile.initials,
      },
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      message: 'Internal server error during token refresh' 
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return res.status(401).json({ message: 'User profile not found' });
    }

    // Ensure initials exist (for existing users who might not have them)
    if (!profile.initials && profile.first_name && profile.last_name) {
      const initials = generateInitials(profile.first_name, profile.last_name);
      await supabase
        .from('profiles')
        .update({ 
          initials,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      profile.initials = initials;
    }

    res.json({
      id: profile.id,
      email: profile.email,
      role: profile.role,
      first_name: profile.first_name,
      last_name: profile.last_name,
      initials: profile.initials,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};