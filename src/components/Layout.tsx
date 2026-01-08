import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Tags, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';
import { translations } from '../utils/translations';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useAppContext();
  const t = translations[settings.language] || translations.en;
  const isRtl = settings.language === 'ar';

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/' },
    { icon: Receipt, label: t.transactions, path: '/transactions' },
    { icon: PieChart, label: t.reports, path: '/reports' },
    { icon: Tags, label: t.categories, path: '/categories' },
    { icon: Settings, label: t.settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={clsx(
        "fixed inset-y-0 w-64 bg-white dark:bg-slate-900 z-40 transform transition-transform duration-300 md:hidden",
        isRtl ? (isMobileMenuOpen ? "right-0 translate-x-0" : "right-0 translate-x-full") : (isMobileMenuOpen ? "left-0 translate-x-0" : "left-0 -translate-x-full")
      )}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">FinanceFlow</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
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
      </div>

      <div className={clsx(
        "flex-1 flex flex-col min-h-screen w-full",
        !isRtl ? "md:pl-64" : "md:pr-64"
      )}>
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-20">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-slate-800 dark:text-white">FinanceFlow</span>
          </div>
          <button 
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
