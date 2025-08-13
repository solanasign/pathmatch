import { jwtDecode } from 'jwt-decode';

// Supabase JWT payload structure
interface SupabaseJWTPayload {
  sub: string; // user id
  email: string;
  role?: string;
  exp: number;
  iat: number;
  aud: string;
  iss: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin';
  initials?: string;
  firstName?: string;
  lastName?: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken => {
  try {
    const supabasePayload = jwtDecode<SupabaseJWTPayload>(token);
    
    // Convert Supabase payload to our DecodedToken format
    return {
      userId: supabasePayload.sub,
      email: supabasePayload.email,
      role: (supabasePayload.role as any) || 'job_seeker',
      exp: supabasePayload.exp,
      iat: supabasePayload.iat,
    };
  } catch (error) {
    console.error('Token decode error:', error);
    throw new Error('Invalid token format');
  }
};

export const verifyToken = (token: string): DecodedToken => {
  try {
    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      throw new Error('Token has expired');
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid or expired token');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true; // Consider invalid tokens as expired
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const decoded = decodeToken(token);
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
}; 