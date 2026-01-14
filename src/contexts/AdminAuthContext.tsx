import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { md5 } from 'js-md5';

interface User {
  id: number;
  login: string;
  isadmin: number;
}

interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('sicaf_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('sicaf_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${GITHUB_BASE_URL}/users.json`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const users = await response.json();
      const hashedPassword = md5(password);
      
      const foundUser = users.find(
        (u: { login: string; pawd: string }) => 
          u.login === username && u.pawd === hashedPassword
      );

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          login: foundUser.login,
          isadmin: foundUser.isadmin
        };
        setUser(userData);
        localStorage.setItem('sicaf_admin_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sicaf_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isadmin === 1,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
