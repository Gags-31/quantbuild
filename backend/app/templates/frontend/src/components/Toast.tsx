import { useState, useCallback, useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const ICONS: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

const COLORS: Record<ToastType, string> = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  error: "bg-rose-50 border-rose-200 text-rose-700",
  info: "bg-brand-50 border-brand-200 text-brand-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
};

export default function Toast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    window.showToast = show;
  }, [show]);

  return (
    <div id="toast-container" className="fixed top-6 right-6 z-[70] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${COLORS[t.type]} shadow-lg shadow-black/10 animate-slide-up animate-stagger-1`}
        >
          <span className="text-lg mt-0.5 shrink-0">{ICONS[t.type]}</span>
          <div>
            <div className="font-semibold text-sm">{t.title}</div>
            {t.message && <div className="text-xs text-opacity-80 mt-0.5">{t.message}</div>}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-2 text-opacity-50 hover:text-opacity-100 mt-0.5"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
