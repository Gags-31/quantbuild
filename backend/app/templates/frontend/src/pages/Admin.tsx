import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { AuthUser } from "../api/client";
import DataTable from "../components/DataTable";
import Spinner from "../components/Spinner";

export default function Admin() {
  const [users, setUsers] = useState<AuthUser[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .list<AuthUser>("users")
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users"));
  }, []);

  if (error) return <div className="p-10 text-center text-rose-600">{error}</div>;
  if (!users) return <Spinner />;

  return (
    <div className="page-gradient min-h-screen">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin console</h1>
            <p className="text-slate-500 text-sm">Manage platform users</p>
          </div>
          <span className="badge badge-warning px-3 py-1">Super admin</span>
        </div>
        <div className="glass-card p-6">
          <DataTable
            columns={[
              { key: "id", label: "ID" },
              { key: "email", label: "Email" },
              { key: "full_name", label: "Name" },
              { key: "role", label: "Role" },
            ]}
            rows={users as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>
    </div>
  );
}
