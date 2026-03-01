import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastData { id: number; message: string; type: 'success' | 'error' | 'info'; }

let toastId = 0;
let addToastFn: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  addToastFn?.(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10B981' };
      case 'error': return { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#EF4444' };
      default: return { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#A855F7' };
    }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none safe-area-top px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          const c = getColors(toast.type);
          return (
            <motion.div key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="px-5 py-3 rounded-2xl text-sm font-medium pointer-events-auto max-w-sm text-center"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, backdropFilter: 'blur(20px)' }}>
              {toast.type === 'success' && '✓ '}{toast.type === 'error' && '✕ '}{toast.message}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
