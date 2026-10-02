import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useCart();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-sm animate-bounce-in">
      <div className="flex items-center gap-3 bg-white text-[#4A2630] px-4 py-3.5 rounded-2xl shadow-xl border border-[#F8BBD0] backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm font-medium leading-snug flex-1">{toastMessage}</div>
        <button
          onClick={clearToast}
          className="text-[#8A6870] hover:text-[#D81B60] transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
