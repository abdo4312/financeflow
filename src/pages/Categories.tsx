import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { TransactionType } from '../types';
import { translations } from '../utils/translations';

/**
 * Categories component for managing transaction categories.
 * Allows users to create, update, and delete categories for organizing their finances.
 */
export const Categories: React.FC = () => {
  const { categories, addCategory, deleteCategory, updateCategory, settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<TransactionType>('expense');
  
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<TransactionType>('expense');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName,
        type: newCategoryType,
        color: newCategoryType === 'income' ? '#22c55e' : '#ef4444', // Default colors
        icon: 'Tag' // Default icon
      });
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (category: any) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
    setEditType(category.type);
  };

  const handleUpdateCategory = (id: string) => {
    if (editName.trim()) {
      const original = categories.find(c => c.id === id);
      if (original) {
        updateCategory(id, {
          ...original,
          name: editName,
          type: editType,
          color: editType !== original.type 
            ? (editType === 'income' ? '#22c55e' : '#ef4444') 
            : original.color
        });
      }
      setEditingCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.categories}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your income and expense categories</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary gap-2 w-full sm:w-auto justify-center"
          disabled={isAdding}
        >
          <Plus size={20} /> {t.addCategory}
        </button>
      </div>

      {isAdding && (
        <div className="card animate-in fade-in slide-in-from-top-4 duration-300 border-2 border-blue-100 dark:border-blue-900/30">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t.newCategory}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="label dark:text-slate-300">{t.name}</label>
              <input
                type="text"
                className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t.name}
                autoFocus
              />
            </div>
            <div className="md:col-span-1">
              <label className="label dark:text-slate-300">{t.type}</label>
              <select
                className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as TransactionType)}
              >
                <option value="expense">{t.expense}</option>
                <option value="income">{t.income}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAddCategory} 
                className="btn btn-primary flex-1 py-2 justify-center"
                disabled={!newCategoryName.trim()}
              >
                <Check size={20} className="mr-2" /> {t.save || 'Save'}
              </button>
              <button 
                onClick={() => setIsAdding(false)} 
                className="btn btn-secondary px-4 py-2 justify-center"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="card group hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200">
              {editingCategoryId === category.id ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.name}</label>
                      <input
                        type="text"
                        className="input-field mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.type}</label>
                      <select
                        className="input-field mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as TransactionType)}
                      >
                        <option value="expense">{t.expense}</option>
                        <option value="income">{t.income}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className="btn btn-primary px-4 py-2"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="btn btn-secondary px-4 py-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{category.name}</h3>
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                        category.type === 'income' 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {t[category.type as keyof typeof t]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                      title={t.edit}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.confirmDeleteCategory)) {
                          deleteCategory(category.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center card bg-slate-50/50 dark:bg-slate-800/20 border-dashed">
            <p className="text-slate-500 dark:text-slate-400">{t.noCategoriesYet || 'No categories found. Add your first one!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
