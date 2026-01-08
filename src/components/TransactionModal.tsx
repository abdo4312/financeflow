import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Transaction, TransactionType } from '../types';
import { clsx } from 'clsx';
import { translations } from '../utils/translations';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  transactionToEdit?: Transaction;
}

interface FormData {
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  description: string;
}

/**
 * TransactionModal component for adding or editing financial transactions.
 * Uses react-hook-form for form management and validation.
 */
export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, defaultType = 'expense', transactionToEdit }) => {
  const { addTransaction, updateTransaction, categories, settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const [type, setType] = useState<TransactionType>(defaultType);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      type: defaultType,
      date: new Date().toISOString().split('T')[0],
      amount: undefined
    }
  });

  // Reset form when modal opens or defaultType changes
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setType(transactionToEdit.type);
        setValue('type', transactionToEdit.type);
        setValue('amount', transactionToEdit.amount);
        setValue('categoryId', transactionToEdit.categoryId);
        setValue('date', new Date(transactionToEdit.date).toISOString().split('T')[0]);
        setValue('description', transactionToEdit.description);
      } else {
        setType(defaultType);
        setValue('type', defaultType);
        setValue('date', new Date().toISOString().split('T')[0]);
        setValue('amount', undefined as any);
        setValue('categoryId', '');
        setValue('description', '');
      }
    }
  }, [isOpen, defaultType, transactionToEdit, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: FormData) => {
    const transactionData = {
      ...data,
      amount: Number(data.amount),
      type: type, // Use local state type as it might have changed via toggle
      date: new Date(data.date).toISOString()
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    reset();
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{transactionToEdit ? t.editTransaction : t.addTransaction}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={clsx(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 border transition-colors",
                type === 'expense'
                  ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <Minus size={18} /> {t.expense}
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={clsx(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 border transition-colors",
                type === 'income'
                  ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <Plus size={18} /> {t.income}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label dark:text-slate-300">{t.amount}</label>
              <div className="relative">
                <span className={clsx(
                  "absolute top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold",
                  settings.language === 'ar' ? "right-3" : "left-3"
                )}>$</span>
                <input
                  type="number"
                  step="0.01"
                  className={clsx(
                    "input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white text-lg font-bold",
                    settings.language === 'ar' ? "pr-8" : "pl-8"
                  )}
                  placeholder="0.00"
                  {...register('amount', { required: true, min: 0.01 })}
                />
              </div>
              {errors.amount && <span className="text-red-500 dark:text-red-400 text-sm">{t.amountRequired}</span>}
            </div>

            <div>
              <label className="label dark:text-slate-300">{t.category}</label>
              <select className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white" {...register('categoryId', { required: true })}>
                <option value="">{t.selectCategory}</option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <span className="text-red-500 dark:text-red-400 text-sm">{t.categoryRequired}</span>}
            </div>

            <div>
              <label className="label dark:text-slate-300">{t.date}</label>
              <input
                type="date"
                className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                {...register('date', { required: true })}
              />
            </div>

            <div>
              <label className="label dark:text-slate-300">{t.description}</label>
              <textarea
                className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white h-24 resize-none"
                placeholder={t.whatWasThisFor}
                {...register('description', { required: true })}
              />
              {errors.description && <span className="text-red-500 dark:text-red-400 text-sm">{t.descriptionRequired}</span>}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-secondary flex-1">{t.cancel}</button>
              <button type="submit" className={clsx("btn flex-1", type === 'income' ? "btn-primary bg-green-600 hover:bg-green-700" : "btn-danger")}>
                {t.saveTransaction}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
