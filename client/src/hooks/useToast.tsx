import { useState, useCallback } from 'react';

export interface ToastOptions {
  duration?: number;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    message: string,
    type: Toast['type'] = 'info',
    options: ToastOptions = {}
  ) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 11);

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration: options.duration,
        actionLabel: options.actionLabel,
        onAction: options.onAction,
      },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => addToast(message, 'success', options), [addToast]);
  const error = useCallback((message: string, options?: ToastOptions) => addToast(message, 'error', options), [addToast]);
  const info = useCallback((message: string, options?: ToastOptions) => addToast(message, 'info', options), [addToast]);
  const warning = useCallback((message: string, options?: ToastOptions) => addToast(message, 'warning', options), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
