import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="page-gradient min-h-screen">
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <div className="animate-fade-in">
          <a href="/" className="text-sm font-medium text-brand-600 hover:underline mb-4 inline-block">← Back to dashboard</a>
          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-brand-500/30">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{user.full_name}</h2>
            <p className="text-brand-600 font-medium text-sm mb-4">{user.email}</p>
            <div className="flex justify-center gap-3">
              <span className="badge badge-slate px-3 py-1.5">Role: {user.role}</span>
              <span className="badge badge-success px-3 py-1.5">Active</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-500">Member since</div>
                <div className="font-medium text-slate-800">Today</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-500">Account ID</div>
                <div className="font-mono text-sm font-medium text-slate-800">#{user.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
