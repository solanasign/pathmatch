import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DecodedToken, getStoredToken, setStoredToken, removeStoredToken, verifyToken, isTokenExpired } from '../../../utils/jwt';

interface UserProfile extends DecodedToken {
  id?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  role: 'job_seeker' | 'employer' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
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
        ...verifyToken(token),
        id: profileData.id,
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

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const currentToken = getStoredToken();
      if (!currentToken) return false;

      // Check if token is expired
      if (isTokenExpired(currentToken)) {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const { access_token } = await refreshResponse.json();
        setStoredToken(access_token);
        
        const userProfile = await fetchUserProfile(access_token);
        if (userProfile) {
          setUser(userProfile);
          setIsAuthenticated(true);
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Token expired, attempting refresh...');
            const refreshed = await refreshToken();
            if (!refreshed) {
              setLoading(false);
              return;
            }
          } else {
            const decoded = verifyToken(token);
            const userProfile = await fetchUserProfile(token);
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              // Profile fetch failed, but token is valid - use basic info
              setUser({
                ...decoded,
                role: decoded.role || 'job_seeker',
              });
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          removeStoredToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [refreshToken]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = getStoredToken();
      if (token && isTokenExpired(token)) {
        console.log('Token expired, refreshing...');
        await refreshToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken]);

  const login = async (token: string): Promise<void> => {
    try {
      const decoded = verifyToken(token);
      setStoredToken(token);
      
      const userProfile = await fetchUserProfile(token);
      
      if (userProfile) {
        setUser(userProfile);
      } else {
        // Fallback to basic token info if profile fetch fails
        setUser({
          ...decoded,
          role: decoded.role || 'job_seeker',
        });
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid token provided');
    }
  };

  const logout = useCallback(() => {
    removeStoredToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, refreshToken }}>
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