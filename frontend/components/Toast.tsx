'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function Toast({ message, actionLabel, onAction, onClose, isVisible }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm w-full bg-zinc-900 border border-blue-500/30 rounded-lg shadow-2xl shadow-blue-500/20 backdrop-blur-xl p-4 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-200 mb-2 font-medium">{message}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
