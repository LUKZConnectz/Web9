import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; title: string; message?: string; type?: 'success'|'error'|'info'|'warning' };

const ToastContext = createContext<{ show: (t: Omit<Toast,'id'>) => void } | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((payload: Omit<Toast,'id'>) => {
    setToasts((cur) => {
      // dedupe by title+message
      if (cur.some(t => t.title === payload.title && t.message === payload.message)) return cur;
      const next: Toast = { id: String(Date.now()) + Math.random().toString(16).slice(2), ...payload };
      return [...cur, next].slice(-4); // keep last 4
    });
  }, []);
  const remove = useCallback((id: string) => setToasts((t) => t.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 9999, display: 'grid', gap: 10, width: 'min(380px, calc(100vw - 36px))', pointerEvents: 'none' }}>
        {toasts.map((t) => (
          <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'} style={{ pointerEvents: 'auto', padding: 14, borderRadius: 12, background: '#fff', boxShadow: '0 18px 45px rgba(15,23,42,.16)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 800 }}>{t.title}</div>
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={() => remove(t.id)} aria-label="close" style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            {t.message ? <div style={{ marginTop: 6, color: '#555' }}>{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
