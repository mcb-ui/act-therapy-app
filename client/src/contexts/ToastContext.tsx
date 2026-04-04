import { createContext, useContext, type ReactNode } from 'react';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';

type ToastContextValue = ReturnType<typeof useToast>;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useAppToast must be used within a ToastProvider');
  }

  return context;
}
