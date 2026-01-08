import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/format';
import { getChartData, filterTransactionsByDate } from '../utils/dateUtils';
import type { TimeRange } from '../utils/dateUtils';
import { clsx } from 'clsx';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { translations } from '../utils/translations';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#ef4444'];

/**
 * Reports component for visualizing financial data over time.
 * Provides detailed breakdowns by category and daily trends for income and expenses.
 */
export const Reports: React.FC = () => {
  const { transactions, categories, settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { transactions: filteredTransactions } = filterTransactionsByDate(transactions, timeRange);

  // Category Breakdown Data (Expenses only)
  const categoryData = categories
    .filter(c => c.type === 'expense')
    .map(c => {
      const total = filteredTransactions
        .filter(t => t.categoryId === c.id && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: c.name, value: total };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const dailyData = getChartData(transactions, timeRange).map(d => ({
    name: d.name,
    Income: d.income,
    Expense: d.expense
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.financialReports}</h1>
        <div className="flex gap-4">
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

           <div className="relative">
             <button
               className="btn btn-secondary gap-2"
               onClick={() => setShowExportMenu(!showExportMenu)}
             >
               <Download size={20} /> {t.downloadReport}
             </button>
             
             {showExportMenu && (
               <>
                 <div
                   className="fixed inset-0 z-10"
                   onClick={() => setShowExportMenu(false)}
                 ></div>
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-20">
                   <button
                     onClick={() => {
                       exportToExcel(filteredTransactions, categories);
                       setShowExportMenu(false);
                     }}
                     className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     <FileSpreadsheet size={18} className="text-green-600 dark:text-green-400" />
                     {t.excelReport}
                   </button>
                   <button
                     onClick={() => {
                       exportToPDF(filteredTransactions, categories);
                       setShowExportMenu(false);
                     }}
                     className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     <FileText size={18} className="text-red-600 dark:text-red-400" />
                     {t.pdfReport}
                   </button>
                 </div>
               </>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.expenseBreakdown}</h3>
          <div className="h-[300px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent != null ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    formatter={(value: any) => [formatCurrency(Number(value) || 0, settings.currency, settings.language), '']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">{t.noExpenseData}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.incomeVsExpense}</h3>
          <div className="h-[300px] flex items-center justify-center">
            {dailyData.some(d => d.Income > 0 || d.Expense > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
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
                    formatter={(value: any) => [formatCurrency(Number(value) || 0, settings.currency, settings.language), '']} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="Income" fill="#22c55e" name={t.income} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef4444" name={t.expense} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">{t.noTransactionsYet}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.topSpendingCategories}</h3>
        <div className="space-y-4">
          {categoryData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className="text-slate-900 dark:text-white">{formatCurrency(item.value, settings.currency, settings.language)}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${(item.value / categoryData[0].value) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          {categoryData.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400">{t.noExpenseData}</p>
          )}
        </div>
      </div>
    </div>
  );
};
