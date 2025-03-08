
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "আদমিন ইউজার",
    email: "admin@example.com",
    phone: "01711111111",
    role: "admin",
  },
  {
    id: "2",
    name: "শিক্ষক ইউজার",
    email: "teacher@example.com",
    phone: "01722222222",
    role: "teacher",
  }
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAllowed: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is a mock authentication - in a real app, you'd call an API
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      throw new Error("ইমেইল বা পাসওয়ার্ড ভুল");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAllowed = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAllowed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
