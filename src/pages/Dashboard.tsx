import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { clsx } from 'clsx';
import { TransactionModal } from '../components/TransactionModal';
import { Plus, Minus, PieChart } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import { getChartData } from '../utils/dateUtils';
import type { TimeRange } from '../utils/dateUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TransactionType } from '../types';
import { translations } from '../utils/translations';

/**
 * Dashboard component that provides a high-level overview of the user's financial status.
 * Displays summary cards for balance, income, and expenses, along with an interactive chart.
 */
export const Dashboard: React.FC = () => {
  const { transactions, settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  const openModal = (type: TransactionType) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const balance = totalIncome - totalExpense;

  const chartData = getChartData(transactions, timeRange);

  return (
    <div className="space-y-6">
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultType={modalType}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.dashboard}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.welcomeBack}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openModal('expense')} className="btn btn-secondary gap-2">
            <Minus size={20} /> {t.addExpense}
          </button>
          <button onClick={() => openModal('income')} className="btn btn-primary gap-2">
            <Plus size={20} /> {t.addIncome}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title={t.totalBalance} amount={balance} type="balance" />
        <SummaryCard title={t.totalIncome} amount={totalIncome} type="income" />
        <SummaryCard title={t.totalExpenses} amount={totalExpense} type="expense" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.overview}</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={clsx(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    timeRange === range ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {t[range as keyof typeof t]}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value, settings.currency, settings.language)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    formatter={(value: number | undefined) => [formatCurrency(value || 0, settings.currency, settings.language), '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">{t.noTransactionsYet}</p>
                <button 
                  onClick={() => openModal('expense')}
                  className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {t.addExpense}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.recentTransactions}</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    transaction.type === 'income' ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  )}>
                    {transaction.type === 'income' ? <Plus size={20} /> : <Minus size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{transaction.description}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(transaction.date, settings.language)}</p>
                  </div>
                </div>
                <span className={clsx(
                  "font-bold whitespace-nowrap",
                  transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency, settings.language)}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">{t.noTransactionsYet}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
