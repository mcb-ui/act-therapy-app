import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  confirmIcon?: ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
  confirmIcon,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const confirmButtonClass =
    tone === 'danger'
      ? 'bg-inferno-red text-white hover:bg-inferno-red/90'
      : 'bg-midnight-purple text-white hover:bg-midnight-purple/90';

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-midnight-purple/35 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-[1.75rem] border border-midnight-purple/10 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-inferno-red/10 text-inferno-red">
            {confirmIcon ?? <AlertTriangle size={22} />}
          </div>
          <div className="flex-1">
            <h2 className="font-subheader text-lg uppercase text-midnight-purple">{title}</h2>
            <p className="mt-3 font-body text-sm leading-6 text-gray-600">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-2xl px-6 py-3 font-subheader text-xs uppercase tracking-[0.18em] transition ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
