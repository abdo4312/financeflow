/**
 * @file AuthContext.tsx
 * @description Authentication context provider for managing user state, login, and logout.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

/**
 * User interface defining the structure of the authenticated user object.
 */
interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  currency: string;
  language: string;
}

/**
 * Interface for the Authentication Context.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application and provides authentication state.
 * @param children - React components that will have access to the context.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Effect to load the user profile on application mount if a token exists.
   */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.get('/users/profile');
          setUser(response.data.data);
        } catch (error) {
          // If profile fetch fails, tokens might be invalid/expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Logs in the user by storing tokens and setting user data.
   * @param accessToken - JWT Access Token.
   * @param refreshToken - JWT Refresh Token.
   * @param userData - The user object returned from the API.
   */
  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  /**
   * Logs out the user by clearing tokens locally and notifying the backend.
   */
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Notify backend to invalidate the refresh token
        await api.post('/auth/logout', { token: refreshToken });
      }
    } catch (error) {
      // Log failed logout attempts but proceed with local cleanup
      console.error('Logout failed on server:', error);
    } finally {
      // Local cleanup
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 * @throws Error if used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
