import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastOptions } from '../hooks/useToast';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
  actionLabel?: ToastOptions['actionLabel'];
  onAction?: ToastOptions['onAction'];
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
  actionLabel,
  onAction,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const styles = {
    success: {
      container: 'border-electric-blue/20 bg-white text-midnight-purple',
      icon: 'bg-electric-blue/10 text-electric-blue',
      action: 'hover:bg-electric-blue/10',
    },
    error: {
      container: 'border-inferno-red/30 bg-white text-midnight-purple',
      icon: 'bg-inferno-red/10 text-inferno-red',
      action: 'hover:bg-inferno-red/10',
    },
    info: {
      container: 'border-midnight-purple/20 bg-white text-midnight-purple',
      icon: 'bg-midnight-purple/10 text-midnight-purple',
      action: 'hover:bg-midnight-purple/10',
    },
    warning: {
      container: 'border-brand-pink/40 bg-parchment text-midnight-purple',
      icon: 'bg-white text-inferno-red',
      action: 'hover:bg-white/80',
    },
  };

  return (
    <div className={`max-w-md rounded-2xl border px-5 py-4 shadow-2xl animate-slide-in-right ${styles[type].container}`}>
      <div className="flex items-start space-x-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${styles[type].icon}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-body font-medium leading-6">{message}</p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                void onAction();
                onClose();
              }}
              className={`mt-3 rounded-full border border-current/15 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] transition ${styles[type].action}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    actionLabel?: string;
    onAction?: () => void | Promise<void>;
  }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed inset-x-4 top-4 z-50 space-y-3 sm:left-auto sm:right-4 sm:top-4 sm:w-auto">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
