import { useState, useEffect } from 'react';
import { User } from '../types';

const VALID_USERS: Record<string, { password: string; user: User }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@inventory.com',
      role: 'admin',
      fullName: 'Administrator',
      createdAt: new Date(),
      lastLogin: new Date()
    }
  },
  'manager': {
    password: 'manager123',
    user: {
      id: '2',
      username: 'manager',
      email: 'manager@inventory.com',
      role: 'manager',
      fullName: 'Inventory Manager',
      createdAt: new Date(),
      lastLogin: new Date()
    }
  },
  'staff': {
    password: 'staff123',
    user: {
      id: '3',
      username: 'staff',
      email: 'staff@inventory.com',
      role: 'staff',
      fullName: 'Staff Member',
      createdAt: new Date(),
      lastLogin: new Date()
    }
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('inventory_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError('');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (VALID_USERS[username] && VALID_USERS[username].password === password) {
      const user = { ...VALID_USERS[username].user, lastLogin: new Date() };
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('inventory_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    } else {
      setLoginError('Invalid username or password. Try: admin / admin123');
      setIsLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('inventory_user');
    // Clear all inventory data on logout
    const keysToRemove = ['inventory_products', 'inventory_vendors', 'inventory_customers', 'inventory_purchaseOrders', 'inventory_sales'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  return { isAuthenticated, currentUser, loginError, isLoading, login, logout };
};