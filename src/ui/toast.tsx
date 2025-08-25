import { createContext, ReactNode, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Toast = {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
};

const ToastContext = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (t: Omit<Toast, 'id'>) => setToasts(list => [...list, { id: Date.now(), ...t }]);
  const remove = (id: number) => setToasts(list => list.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="fixed bottom-4 inset-x-0 flex flex-col items-center space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-800 text-white px-4 py-2 rounded-md shadow flex items-center"
            >
              <span>{t.message}</span>
              {t.action && (
                <button
                  className="ml-2 underline"
                  onClick={() => {
                    t.action!.onClick();
                    remove(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

