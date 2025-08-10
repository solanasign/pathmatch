import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/db';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user profile and attach to request
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: 'User profile not found' });
    }

    req.user = {
      id: profile.id,
      role: profile.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Specific role middleware functions
export const requireJobSeeker = authorize(['job_seeker']);
export const requireEmployer = authorize(['employer']);
export const requireAdmin = authorize(['admin']);
export const requireEmployerOrAdmin = authorize(['employer', 'admin']);