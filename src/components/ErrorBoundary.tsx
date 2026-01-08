import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Get language from localStorage
      const settings = JSON.parse(localStorage.getItem('settings') || '{"language":"en"}');
      const isArabic = settings.language === 'ar';

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isArabic ? 'حدث خطأ ما' : 'Something went wrong'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
            {isArabic
              ? 'واجهنا خطأ غير متوقع. يرجى تحديث الصفحة.'
              : 'We encountered an unexpected error. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2"
          >
            <RefreshCw size={18} /> {isArabic ? 'إعادة تحميل الصفحة' : 'Reload Page'}
          </button>
          {this.state.error && (
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-left w-full max-w-lg overflow-auto">
              <p className="font-mono text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {this.state.error.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
