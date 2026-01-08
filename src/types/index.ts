export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string; // We'll store icon name as string
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO string
  description: string;
}

export interface UserSettings {
  currency: string;
  darkMode: boolean;
  name: string;
  language: 'en' | 'ar';
}
