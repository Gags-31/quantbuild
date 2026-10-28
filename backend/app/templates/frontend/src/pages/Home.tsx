import { Link } from "react-router-dom";
import type { AppInfo } from "../appInfo";

interface HomeProps {
  appInfo: AppInfo;
}

export default function Home({ appInfo }: HomeProps) {
  return (
    <div className="min-h-screen page-gradient">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-4 animate-stagger-1">
            Built with QuantBuild
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight animate-stagger-2">
            {appInfo.name}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">{appInfo.appType}</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto animate-stagger-3">
            {appInfo.summary || "A modern full-stack application — login, dashboard, and full CRUD for every resource."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-stagger-3">
            <Link to="/register" className="btn-primary">
              Create your account
            </Link>
            <Link to="/login" className="btn-outline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <div className="text-xs font-medium text-slate-500 mb-1">Platform</div>
              <div className="text-2xl font-bold text-slate-800">{100 + i * 25}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Everything you need</h2>
            <Link to="/register" className="text-sm font-medium text-brand-600 hover:underline">
              Start building →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {appInfo.features.map((feat) => (
              <div key={feat} className="glass-card p-6 hover:border-brand-200 transition border border-transparent group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <span className="text-lg">🚀</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{feat}</h3>
                <p className="text-sm text-slate-500">Production-ready and fully integrated.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center animate-fade-in">
          <Link to="/register" className="btn-primary px-8 py-4">
            Get started today
          </Link>
        </div>
      </div>
    </div>
  );
}
