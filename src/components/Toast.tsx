'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              isError
                ? 'bg-red-950/80 border-red-500/40 text-red-200'
                : isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {!isError && !isSuccess && <Info className="w-4 h-4 text-cyan-400" />}
            </div>

            <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-white/50 hover:text-white transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
