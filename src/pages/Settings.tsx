import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Moon, Sun, DollarSign, Bell, Shield, Languages } from 'lucide-react';
import { translations } from '../utils/translations';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const t = translations[settings.language] || translations.en;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.settings}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
            {t.preferences}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t.currency}</p>
                <p className="text-sm text-slate-500">{t.currencyDesc}</p>
              </div>
            </div>
            <select 
              className="input-field w-32"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
            >
              <option value="USD">USD ($)</option>
              <option value="EGP">EGP (ج.م)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t.darkMode}</p>
                <p className="text-sm text-slate-500">{t.darkModeDesc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Languages size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t.language}</p>
                <p className="text-sm text-slate-500">{t.languageDesc}</p>
              </div>
            </div>
            <select 
              className="input-field w-32"
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'ar' })}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t.notifications}</p>
                <p className="text-sm text-slate-500">{t.notificationsDesc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
            {t.account}
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
              <User size={32} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{t.profile}</h4>
              <p className="text-slate-500">user@example.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                <Shield size={20} /> {t.security}
              </span>
              <span className="text-slate-400">→</span>
            </button>
            
            <button className="w-full btn btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-900/20">
              {t.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
