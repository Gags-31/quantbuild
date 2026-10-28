import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import DataTable from "../components/DataTable";
import FormField from "../components/FormField";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import type { EntityConfig } from "../entityConfig";
import { appInfo } from "../appInfo";

export default function EntityListPage({ config }: { config: EntityConfig }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .list<Record<string, unknown>>(config.resource)
      .then(setRows)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [config.resource]);

  useEffect(load, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!search.trim()) return rows;
    const needle = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(needle))
    );
  }, [rows, search]);

  const openCreate = () => {
    const initial: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.input === "checkbox") initial[field.key] = false;
      else if (field.input === "number") initial[field.key] = 0;
      else initial[field.key] = "";
    }
    setForm(initial);
    setEditing({});
    setFormError("");
  };

  const openEdit = (row: Record<string, unknown>) => {
    setForm({ ...row });
    setEditing(row);
    setFormError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = form[field.key];
      if (field.input === "number") payload[field.key] = Number(value);
      else if (field.input === "checkbox") payload[field.key] = Boolean(value);
      else if (value === "" && !field.required) continue;
      else payload[field.key] = value;
    }
    try {
      if (editing && typeof editing.id === "number") {
        await api.update(config.resource, editing.id, payload);
      } else {
        await api.create(config.resource, payload);
      }
      setEditing(null);
      load();
      window.showToast?.("success", "Saved", "Changes have been saved successfully.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: Record<string, unknown>) => {
    if (!window.confirm("Delete this record?")) return;
    await api.remove(config.resource, row.id as number);
    load();
    window.showToast?.("success", "Deleted", "Record removed successfully.");
  };

  if (error) return <div className="p-10 text-center text-rose-600">{error}</div>;
  if (!rows) return <Spinner />;

  const isNew = editing && typeof editing.id !== "number";

  return (
    <div className="page-gradient min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <a href="/" className="text-sm font-medium text-brand-600 hover:underline mb-2 inline-block">
              ← Back to dashboard
            </a>
            <h1 className="text-2xl font-bold text-slate-900">{config.label}</h1>
            <p className="text-slate-500 text-sm">
              Browse, create, edit and delete {config.label.toLowerCase()}.
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            + New {config.label.slice(0, -1)}
          </button>
        </div>

        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-4 mb-6">
            <input
              placeholder={`Search ${config.label.toLowerCase()}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1 max-w-md"
            />
            <div className="text-sm text-slate-500">
              {filtered.length} of {rows.length} records
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {filtered.length === 0 ? (
              <EmptyState
                title={`No ${config.label.toLowerCase()} found`}
                hint="Create the first one."
              />
            ) : (
              <DataTable
                columns={config.columns}
                rows={filtered}
                onEdit={openEdit}
                onDelete={remove}
              />
            )}
          </div>
        </div>

        {editing && (
          <div className="animate-fade-in animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">
                  {isNew ? "Create" : "Edit"} {config.label}
                </h3>
                <button
                  onClick={() => setEditing(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={save} className="space-y-4">
                {config.fields.map((field) => (
                  <FormField key={field.key} label={field.label}>
                    {field.input === "textarea" ? (
                      <textarea
                        required={field.required}
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="input-field min-h-[80px] resize-none"
                      />
                    ) : field.input === "checkbox" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(form[field.key])}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-slate-600">{field.label}</span>
                      </div>
                    ) : (
                      <input
                        type={field.input}
                        required={field.required}
                        step={field.input === "number" ? "any" : undefined}
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="input-field"
                      />
                    )}
                  </FormField>
                ))}
                {formError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className={busy ? "btn-primary opacity-90 cursor-wait" : "btn-primary"}
                  >
                    {busy ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
