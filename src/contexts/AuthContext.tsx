
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our context
type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Mock user type
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'staff' | 'user';
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Context provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For demo purposes, simulate an authenticated user (admin)
  useEffect(() => {
    // Simulating loading auth state
    setTimeout(() => {
      setUser({
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      });
      setIsLoading(false);
    }, 1000);
  };

  // Mock logout function
  const logout = async () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setUser(null);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
