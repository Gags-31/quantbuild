interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  accent?: string;
}

export default function StatCard({ title, value, icon, trend, accent = "brand" }: StatCardProps) {
  const accentColors: Record<string, string> = {
    brand: "text-brand-600 bg-brand-50 border-brand-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };
  return (
    <div className="glass-card p-5 border-l-4 border-transparent hover:border-l-brand-500 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {trend && (
              <span className={`text-xs font-medium ${trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColors[accent]}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}
