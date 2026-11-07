import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { EntityConfig } from "../entityConfig";
import { appInfo } from "../appInfo";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";

const ICONS: Record<string, string> = {
  products: "📦", carts: "🛒", orders: "🧾", payments: "💳",
  order_items: "🧾", cart_items: "🛒", categorys: "🗂️", categories: "🗂️",
  notifications: "🔔", wishlists: "💙", wishlist_items: "💙",
  events: "🎟️", tickets: "🎫", articles: "📝", posts: "📝",
  students: "🎓", courses: "📚", enrollments: "🎓", invoices: "🧾",
  employees: "🧑‍💼", departments: "🏢", tasks: "✅", projects_p: "📁",
};

function pickIcon(resource: string): string {
  return ICONS[resource] ?? "📦";
}

export default function Dashboard({ entityConfigs }: { entityConfigs: EntityConfig[] }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const ACCENTS = ["brand", "emerald", "rose", "amber", "purple"] as const;

  useEffect(() => {
    let alive = true;
    Promise.all(
      entityConfigs.map((cfg) =>
        api
          .list<Record<string, unknown>>(cfg.resource)
          .then((rows) => [cfg.resource, rows.length] as const)
          .catch(() => [cfg.resource, 0] as const)
      )
    ).then((entries) => {
      if (alive) {
        setCounts(Object.fromEntries(entries));
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [entityConfigs]);

  const total = useMemo(
    () => Object.values(counts).reduce((a: number, b) => a + Number(b || 0), 0),
    [counts]
  );

  const chartData = useMemo(() => {
    const rows = entityConfigs.map((cfg) => ({
      label: cfg.label,
      value: Number(counts[cfg.resource] ?? 0),
    }));
    const max = Math.max(1, ...rows.map((r) => r.value));
    return { rows, max };
  }, [entityConfigs, counts]);

  if (loading) return <Spinner />;

  return (
    <div className="page-gradient min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">
              Welcome back, {user?.full_name}. Here is your platform overview.
            </p>
          </div>
          <Link to="/admin" className="btn-outline hidden md:block">
            Admin console
          </Link>
        </div>

        {/* Total records hero */}
        <div className="glass-panel-light mb-6 p-6 flex items-center justify-between animate-fade-in"
             style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(147,51,234,0.06))" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Total records</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-slate-900 animate-count-up">{total}</span>
              <span className="text-sm text-slate-500">across {entityConfigs.length} resources</span>
            </div>
          </div>
          <span className="badge badge-brand px-3 py-1.5 hidden sm:block">
            🟢 Live — served by your generated API
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-fade-in"
             style={{ animationDelay: "0.15s" }}>
          {entityConfigs.map((cfg, i) => (
            <StatCard
              key={cfg.resource}
              title={cfg.label}
              value={counts[cfg.resource] ?? 0}
              icon={pickIcon(cfg.resource)}
              trend={Number(counts[cfg.resource] ?? 0) > 0 ? "seeded data" : undefined}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        {/* Analytics chart (pure SVG — no external library) */}
        <div className="glass-panel-light p-6 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">Resource analytics</h2>
              <p className="text-xs text-slate-500 mt-0.5">Records per table — rendered from live API data</p>
            </div>
            <span className="badge badge-success">updated just now</span>
          </div>
          <div className="flex items-end gap-3 h-44 px-2">
            {chartData.rows.map((r, i) => (
              <div key={r.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-slate-700">{r.value}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700 animate-grow"
                  style={{
                    height: `${(r.value / chartData.max) * 100}%`,
                    minHeight: r.value === 0 ? 4 : 6,
                    animationDelay: `${i * 60}ms`,
                    background: "linear-gradient(180deg, #6366f1, #a855f7)",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                  }}
                  title={`${r.label}: ${r.value}`}
                />
                <span className="text-[11px] text-slate-500 truncate w-full text-center"
                      title={r.label}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "0.45s" }}>
          <div className="glass-panel-light p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Manage your resources</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entityConfigs.map((cfg) => (
                <Link
                  key={cfg.resource}
                  to={"/" + cfg.resource}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                >
                  <span className="text-base">{pickIcon(cfg.resource)}</span> {cfg.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="glass-panel-light p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Platform info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Application</span>
                <span className="font-medium text-slate-800">{appInfo.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Resources</span>
                <span className="font-medium text-slate-800">{entityConfigs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Role</span>
                <span className="font-medium text-slate-800 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="badge badge-success">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Explore your data</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {entityConfigs.slice(0, 2).map((cfg) => (
              <Link
                key={cfg.resource}
                to={"/" + cfg.resource}
                className="glass-panel-light group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                  <span className="text-7xl">{pickIcon(cfg.resource)}</span>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="font-bold text-slate-800 mb-1">{cfg.label}</h3>
                  <p className="text-sm text-slate-500 mb-4">View, create, edit and delete records.</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                    Open {cfg.label} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
