import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(email, password, fullName);
      navigate("/dashboard");
      window.showToast?.("success", "Account created!", "Welcome to the platform.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      window.showToast?.("error", "Registration failed", err instanceof Error ? err.message : "");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="text-center mb-8 relative z-10 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 text-lg shadow-lg shadow-emerald-500/30">
            ✨
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm">Join and start building today</p>
        </div>

        <form onSubmit={submit} className="relative z-10 space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className={`btn-primary w-full ${busy ? "opacity-90 cursor-wait" : ""}`}
          >
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 relative z-10">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
