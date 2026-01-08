import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import api from '../../services/api';
import { Wallet, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Login component for user authentication.
 * Handles credential submission and session management upon successful login.
 */
export const Login = () => {
  const { login } = useAuth();
  const { settings } = useAppContext();
  const t = translations[settings.language];
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isRtl = settings.language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, data } = response.data;
      
      login(accessToken, refreshToken, data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/20">
            <Wallet size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">FinanceFlow</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{t.login}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-red-800 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.email}
              </label>
              <div className="relative">
                <div className={clsx(
                  "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
                  isRtl ? "right-0 pr-3" : "left-0 pl-3"
                )}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={clsx(
                    "block w-full py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                  )}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <div className={clsx(
                  "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
                  isRtl ? "right-0 pr-3" : "left-0 pl-3"
                )}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(
                    "block w-full py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                  )}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              t.login
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.dontHaveAccount}{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {t.register}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
