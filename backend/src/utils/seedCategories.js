import Category from '../models/Category.model.js';

const defaultCategories = [
  // Income
  { name: 'Salary', type: 'income', color: '#22c55e', icon: 'Wallet', isDefault: true },
  { name: 'Freelance', type: 'income', color: '#3b82f6', icon: 'Briefcase', isDefault: true },
  { name: 'Investments', type: 'income', color: '#8b5cf6', icon: 'TrendingUp', isDefault: true },
  { name: 'Gifts', type: 'income', color: '#ec4899', icon: 'Gift', isDefault: true },
  { name: 'Other Income', type: 'income', color: '#64748b', icon: 'PlusCircle', isDefault: true },
  
  // Expenses
  { name: 'Housing', type: 'expense', color: '#ef4444', icon: 'Home', isDefault: true },
  { name: 'Food', type: 'expense', color: '#f97316', icon: 'Utensils', isDefault: true },
  { name: 'Transportation', type: 'expense', color: '#a855f7', icon: 'Car', isDefault: true },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'ShoppingBag', isDefault: true },
  { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'Film', isDefault: true },
  { name: 'Bills', type: 'expense', color: '#64748b', icon: 'FileText', isDefault: true },
  { name: 'Healthcare', type: 'expense', color: '#f43f5e', icon: 'HeartPulse', isDefault: true },
  { name: 'Education', type: 'expense', color: '#06b6d4', icon: 'GraduationCap', isDefault: true },
  { name: 'Other Expense', type: 'expense', color: '#94a3b8', icon: 'MoreHorizontal', isDefault: true }
];

export const seedDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments({ isDefault: true });
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};
