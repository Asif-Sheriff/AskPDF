import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'; // You'll need to install this package

const jwt_decode = jwtDecode
interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  [key: string]: any; // For custom claims
}

interface AuthResponse {
  access_token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const decodeUserFromToken = (token: string): User | null => {
    try {
      const decoded = jwt_decode<JwtPayload>(token);
      // Map JWT claims to your User type
      return {
        id: decoded.sub,
        email: decoded.email || '', // Assuming email is in the token
        username: decoded.username || decoded.sub, // Fallback to sub if no username
        // Add other user properties from the token as needed
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Verify token is not expired
          const decoded = jwt_decode<JwtPayload>(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          
          setToken(storedToken);
          setUser(decodeUserFromToken(storedToken));
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { access_token: newToken } = response.data as AuthResponse;
      
      const userData = decodeUserFromToken(newToken);
      if (!userData) {
        throw new Error('Failed to decode user information');
      }
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await authAPI.signup(username, password);
      const { access_token: newToken } = response.data as AuthResponse;
      
      const userData = decodeUserFromToken(newToken);
      if (!userData) {
        throw new Error('Failed to decode user information');
      }
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};