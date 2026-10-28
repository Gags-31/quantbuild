import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { EntityConfig } from "../entityConfig";

const THEMES = [
  { id: "slate", label: "Slate", accent: "text-slate-600", bg: "bg-slate-50" },
  { id: "brand", label: "Indigo", accent: "text-brand-600", bg: "bg-brand-50" },
  { id: "emerald", label: "Emerald", accent: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "rose", label: "Rose", accent: "text-rose-600", bg: "bg-rose-50" },
];

interface NavbarProps {
  entityConfigs: EntityConfig[];
  appInfo: { name: string; appType: string; features: string[] };
}

export default function Navbar({ entityConfigs, appInfo }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState<"slate" | "brand" | "emerald" | "rose">("brand");

  React.useEffect(() => {
    const root = document.documentElement;
    root.className = "";
    root.classList.add(theme === "slate" ? "bg-slate-50" : theme === "brand" ? "bg-brand-50" : theme === "emerald" ? "bg-emerald-50" : "bg-rose-50");
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <span className="text-white font-bold">⚡</span>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">{appInfo.name}</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6">
              <Link className="text-sm font-medium text-slate-600 hover:text-brand-600 transition" to="/dashboard">
                Dashboard
              </Link>
              {entityConfigs.map((cfg) => (
                <Link
                  key={cfg.resource}
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 transition"
                  to={"/" + cfg.resource}
                >
                  {cfg.label}
                </Link>
              ))}
              {["admin", "administrator"].includes((user.role || "").toLowerCase()) && (
                <Link className="text-sm font-medium text-slate-600 hover:text-brand-600 transition" to="/admin">
                  Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const next = THEMES[(THEMES.findIndex(t => t.id === theme) + 1) % THEMES.length].id as typeof theme;
                  setTheme(next);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title="Change theme"
              >
                <span className="text-sm">🎨</span>
              </button>
              {user ? (
                <>
                  <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition">
                    {user.full_name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-sm text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link className="text-sm font-medium text-slate-600 hover:text-brand-600 transition" to="/login">
                    Log in
                  </Link>
                  <Link className="btn-primary text-sm text-white" to="/register">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
          <button className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={() => navigate("/login")}>
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile theme/toast container */}
      <div id="toast-container" className="fixed top-6 right-6 z-[70] flex flex-col gap-2 pointer-events-none" />
    </>
  );
}
