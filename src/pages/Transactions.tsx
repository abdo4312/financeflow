import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { Search, Trash2, Edit2, Download, ChevronLeft, ChevronRight, FileSpreadsheet, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import type { Transaction, TransactionType } from '../types';
import { TransactionModal } from '../components/TransactionModal';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { translations } from '../utils/translations';

/**
 * Transactions component for viewing, filtering, and managing financial records.
 * Features a paginated list of transactions with options to add, edit, or delete entries.
 */
export const Transactions: React.FC = () => {
  const { transactions, categories, deleteTransaction, settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <TransactionModal 
        isOpen={!!editingTransaction} 
        onClose={() => setEditingTransaction(null)} 
        transactionToEdit={editingTransaction || undefined}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.transactions}</h1>
        <div className="relative">
          <button
            className="btn btn-secondary gap-2"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <Download size={20} /> {t.export}
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

      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={clsx(
              "absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
              settings.language === 'ar' ? "right-3" : "left-3"
            )} size={20} />
            <input
              type="text"
              placeholder={t.searchTransactions}
              className={clsx(
                "input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white",
                settings.language === 'ar' ? "pr-10" : "pl-10"
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-48 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="all">{t.allTypes}</option>
            <option value="income">{t.income}</option>
            <option value="expense">{t.expense}</option>
          </select>
          <select
            className="input-field md:w-48 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">{t.allCategories}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">{t.date}</th>
                <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">{t.description}</th>
                <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">{t.category}</th>
                <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">{t.amount}</th>
                <th className={clsx(
                  "py-3 px-4 font-medium text-slate-500 dark:text-slate-400",
                  settings.language === 'ar' ? "text-left" : "text-right"
                )}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{formatDate(transaction.date, settings.language)}</td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{transaction.description}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                      {getCategoryName(transaction.categoryId)}
                    </span>
                  </td>
                  <td className={clsx(
                    "py-3 px-4 font-bold",
                    transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency, settings.language)}
                  </td>
                  <td className={clsx(
                    "py-3 px-4",
                    settings.language === 'ar' ? "text-left" : "text-right"
                  )}>
                    <div className={clsx(
                      "flex items-center gap-2",
                      settings.language === 'ar' ? "justify-start" : "justify-end"
                    )}>
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {t.noTransactionsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card Layout */}
        <div className="md:hidden space-y-4">
          {paginatedTransactions.map(transaction => (
            <div key={transaction.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{transaction.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(transaction.date, settings.language)}</p>
                </div>
                <p className={clsx(
                  "font-bold",
                  transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency, settings.language)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  {getCategoryName(transaction.categoryId)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              {t.noTransactionsFound}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.showing} {((currentPage - 1) * itemsPerPage) + 1} {t.of} {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} {t.of} {filteredTransactions.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
