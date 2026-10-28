export default function EmptyState({ title, hint, icon = "📭" }: { title: string; hint?: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {hint && <p className="text-sm text-slate-500 mt-2 max-w-xs">{hint}</p>}
    </div>
  );
}
