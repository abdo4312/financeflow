import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Tags, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../utils/translations';

export const Sidebar: React.FC = () => {
  const { settings } = useAppContext();
  const { logout } = useAuth();
  const t = translations[settings.language] || translations.en;

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/' },
    { icon: Receipt, label: t.transactions, path: '/transactions' },
    { icon: PieChart, label: t.reports, path: '/reports' },
    { icon: Tags, label: t.categories, path: '/categories' },
    { icon: Settings, label: t.settings, path: '/settings' },
  ];

  return (
    <div className={clsx(
      "hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 border-slate-200 h-screen fixed top-0 z-20",
      settings.language === 'ar' ? "right-0" : "left-0"
    )}>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          F
        </div>
        <span className="text-xl font-bold text-slate-800 dark:text-white">FinanceFlow</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {t.logout}
        </button>
      </div>
    </div>
  );
};
