/**
 * @file AppContext.tsx
 * @description Global application context for managing financial data (transactions, categories) and user settings.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, Category, UserSettings } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

/**
 * Interface defining the global state and actions available in AppContext.
 */
interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  settings: UserSettings;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider component that manages financial data and application settings.
 * Synchronizes state with the backend API and handles theme/language changes.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('settings');
    const defaults: UserSettings = { currency: 'USD', darkMode: false, name: 'User', language: 'en' };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  /**
   * Fetches all transactions and categories from the backend.
   */
  const refreshData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [transRes, catsRes] = await Promise.all([
        api.get('/transactions?limit=100'),
        api.get('/categories')
      ]);
      setTransactions(transRes.data.data);
      setCategories(catsRes.data.data);
    } catch (error) {
      // Errors are handled by api.ts interceptors or ignored here
    } finally {
      setLoading(false);
    }
  };

  /**
   * Re-fetch data whenever the authenticated user changes.
   */
  useEffect(() => {
    if (user) {
      refreshData();
      // Sync local settings with backend user profile
      setSettings(prev => ({
        ...prev,
        name: user.name,
        currency: user.currency || prev.currency,
        language: user.language as 'en' | 'ar' || prev.language
      }));
    }
  }, [user]);

  /**
   * Persist settings to localStorage and apply theme/language classes to the DOM.
   */
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Apply Dark Mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Language and Direction (RTL/LTR)
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings]);

  /**
   * Actions to modify transactions and categories.
   * These methods perform API calls and update local state upon success.
   */

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await api.post('/transactions', transaction);
      setTransactions(prev => [response.data.data, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await api.patch(`/transactions/${id}`, transaction);
      setTransactions(prev => prev.map(t => t.id === id ? response.data.data : t));
    } catch (error) {
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const response = await api.post('/categories', category);
      setCategories(prev => [...prev, response.data.data]);
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Omit<Category, 'id'>) => {
    try {
      const response = await api.patch(`/categories/${id}`, category);
      setCategories(prev => prev.map(c => c.id === id ? response.data.data : c));
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      if (user) {
        // Sync settings change to backend profile
        await api.patch('/users/profile', newSettings);
      }
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      transactions, 
      categories, 
      settings, 
      loading,
      addTransaction, 
      deleteTransaction, 
      updateTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      updateSettings,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to access the AppContext.
 * @throws Error if used outside of an AppProvider.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
