import * as React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/format';
import { useAppContext } from '../context/AppContext';
import { translations } from '../utils/translations';

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: 'income' | 'expense' | 'balance';
  trend?: number;
}

/**
 * SummaryCard component to display key financial metrics like total balance, income, or expenses.
 * Includes optional trend indicators to show changes from the previous period.
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type = 'balance', trend }) => {
  const { settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const isIncome = type === 'income';
  const isExpense = type === 'expense';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 font-medium">{title}</span>
        <div className={clsx(
          "p-2 rounded-lg",
          isIncome ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
          isExpense ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        )}>
          {isIncome ? <ArrowUpRight size={20} /> :
           isExpense ? <ArrowDownRight size={20} /> :
           <DollarSign size={20} />}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(amount, settings.currency, settings.language)}
          </h3>
          {trend !== undefined && (
             <p className={clsx("text-sm mt-1 flex items-center gap-1", trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
               {trend > 0 ? "+" : ""}{trend}% {t.fromLastMonth}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};
