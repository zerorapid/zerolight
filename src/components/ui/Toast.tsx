import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error';
}

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 text-white px-5 py-3 rounded-pill text-[13px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center gap-2 z-[9999] transition-all animate-in fade-in slide-in-from-bottom-3 duration-200',
        isError ? 'bg-status-error' : 'bg-[#0B0F19]'
      )}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 stroke-[2.2]" />
      ) : (
        <CheckCircle2 className="w-4 h-4 stroke-[2.2] text-brand-tint" />
      )}
      <span>{toast.text}</span>
    </div>
  );
};
