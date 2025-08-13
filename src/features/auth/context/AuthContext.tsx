import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Simple interfaces to avoid complex dependencies
export interface UserProfile {
  id?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  role?: 'job_seeker' | 'employer' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for token management
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const removeStoredToken = (): void => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Simple JWT decode without external dependencies
const parseJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT parse error:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) return true;
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired or invalid');
        }
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await response.json();
      
      // Generate initials if not already present
      const initials = profileData.initials || 
        (profileData.first_name && profileData.last_name 
          ? `${profileData.first_name.charAt(0).toUpperCase()}${profileData.last_name.charAt(0).toUpperCase()}`
          : '');

      return {
        id: profileData.id,
        userId: profileData.user_id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        initials,
        role: profileData.role,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const logout = useCallback(() => {
    removeStoredToken();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const login = async (token: string): Promise<void> => {
    try {
      setError(null);
      
      // Basic token validation
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token provided');
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        throw new Error('Token has expired');
      }

      setStoredToken(token);
      
      // Try to fetch user profile
      const userProfile = await fetchUserProfile(token);
      
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        // Fallback to basic token info
        const payload = parseJWT(token);
        if (payload) {
          setUser({
            userId: payload.sub,
            email: payload.email,
            role: payload.role || 'job_seeker',
          });
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid token format');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      logout();
      throw error;
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setError(null);
        const token = getStoredToken();
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, logging out...');
          logout();
          setLoading(false);
          return;
        }

        // Try to get user profile
        const userProfile = await fetchUserProfile(token);
        
        if (userProfile) {
          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          // Fallback to token payload
          const payload = parseJWT(token);
          if (payload && payload.sub && payload.email) {
            setUser({
              userId: payload.sub,
              email: payload.email,
              role: payload.role || 'job_seeker',
            });
            setIsAuthenticated(true);
          } else {
            // Invalid token, remove it
            logout();
          }
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setError(error.message || 'Authentication error');
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 