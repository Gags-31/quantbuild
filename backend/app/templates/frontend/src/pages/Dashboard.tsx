import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { entityConfigs } from "../entityConfig";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const accentMap: Record<string, string> = {
    products: "emerald",
    carts: "brand",
    orders: "rose",
    payments: "amber",
    order_items: "purple",
    cart_items: "brand",
    categorys: "emerald",
    notifications: "brand",
    wishlists: "rose",
    wishlist_items: "brand",
    events: "amber",
    tickets: "rose",
  };

  useEffect(() => {
    Promise.all(
      entityConfigs.map((cfg) =>
        api
          .list<Record<string, unknown>>(cfg.resource)
          .then((rows) => [cfg.resource, rows.length] as const)
          .catch(() => [cfg.resource, 0] as const)
      )
    )
      .then((entries) => setCounts(Object.fromEntries(entries)))
      .finally(() => setLoading(false));
  }, []);

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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {entityConfigs.map((cfg) => (
            <div key={cfg.resource}>
              <StatCard
                title={cfg.label}
                value={counts[cfg.resource] ?? 0}
                icon="📦"
                trend="+12% vs last week"
                accent={accentMap[cfg.resource] ?? "brand"}
              />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Manage your resources</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entityConfigs.map((cfg) => (
                <Link
                  key={cfg.resource}
                  to={"/" + cfg.resource}
                  className="block p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all group flex items-center gap-2"
                >
                  <span className="text-sm">📦</span> {cfg.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Platform info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Application</span>
                <span className="font-medium text-slate-800">{entityConfigs.length + 1} resources</span>
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
                className="glass-card group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="font-bold text-slate-800 mb-1">{cfg.label}</h3>
                  <p className="text-sm text-slate-500 mb-4">View, create, edit and delete records.</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600">
                    Open {cfg.label} → <span>→</span>
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
