// Authentication utilities and context

import { createContext, useContext } from 'react';
import { User } from './mock-data';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  goals: string[];
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication functions
export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'demo123') {
    const { mockUser } = await import('./mock-data');
    return mockUser;
  }
  
  throw new Error('Invalid credentials');
};

export const mockRegister = async (userData: RegisterData): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    goals: userData.goals,
    joinedAt: new Date().toISOString(),
    stats: {
      lessonsCompleted: 0,
      streakDays: 0,
      totalPoints: 0,
      level: 1
    }
  };
};

// Local storage helpers
export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('ai-learning-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('ai-learning-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ai-learning-user');
  }
};