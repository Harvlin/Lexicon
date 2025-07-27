import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/mock-data';
import { 
  AuthContextType, 
  RegisterData, 
  mockLogin, 
  mockRegister, 
  getStoredUser, 
  setStoredUser 
} from '@/lib/auth';

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await mockLogin(email, password);
      setUser(userData);
      setStoredUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const newUser = await mockRegister(userData);
      setUser(newUser);
      setStoredUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};