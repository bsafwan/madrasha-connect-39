
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the shape of our context
type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// User type
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
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

  // Check if there's a logged in user on mount
  useEffect(() => {
    checkUser();
    
    // Cleanup function on unmount
    return () => {};
  }, []);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Check for existing user session
  const checkUser = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@example.com')
        .single();
        
      if (sessionError) {
        // For demo purposes, we're still setting a default user
        // In a real app, this would check localStorage or session cookies
        setUser({
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        });
      } else if (sessionData) {
        setUser({
          id: sessionData.id,
          email: sessionData.email,
          name: sessionData.name,
          role: sessionData.role
        });
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        toast.error("ইমেইল বা পাসওয়ার্ড ভুল");
        throw error;
      }

      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      });
      
      toast.success("সফলভাবে লগইন হয়েছে!");
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      toast.success("সফলভাবে লগআউট হয়েছে");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
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
