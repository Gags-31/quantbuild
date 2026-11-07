import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import DataTable from "../components/DataTable";
import FormField from "../components/FormField";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import type { EntityConfig } from "../entityConfig";

const PAGE_SIZE = 8;

export default function EntityListPage({ config }: { config: EntityConfig }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
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
  useEffect(() => { setPage(0); }, [search, sortKey, sortAsc]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!search.trim()) return rows;
    const needle = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(needle))
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc
        ? String(av ?? "").localeCompare(String(bv ?? ""))
        : String(bv ?? "").localeCompare(String(av ?? ""));
    });
    return copy;
  }, [filtered, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

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
        await api.update(config.resource, editing.id as number, payload);
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
            <a href="#/dashboard" className="text-sm font-medium text-brand-600 hover:underline mb-2 inline-block">
              ← Back to dashboard
            </a>
            <h1 className="text-2xl font-bold text-slate-900">{config.label}</h1>
            <p className="text-slate-500 text-sm">
              Browse, create, edit and delete {config.label.toLowerCase()}.
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary shadow-lg shadow-brand-600/25">
            + New {config.label.replace(/s$/, "")}
          </button>
        </div>

        <div className="glass-panel-light p-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <input
              placeholder={`Search ${config.label.toLowerCase()}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1 min-w-[240px] max-w-md"
            />
            <div className="flex items-center gap-2 text-sm text-slate-500 ml-auto">
              <span className="badge badge-slate">{sorted.length} total</span>
              <select
                value={`${safePage}`}
                onChange={(e) => setPage(Number(e.target.value))}
                className="input-field !py-1.5 !px-3 !w-auto text-sm"
              >
                {Array.from({ length: pageCount }, (_, i) => (
                  <option key={i} value={i}>
                    Page {i + 1} of {pageCount}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {pageRows.length === 0 ? (
            <EmptyState
              title={`No ${config.label.toLowerCase()} found`}
              hint={search.trim() ? "Try a different search term." : "Create the first one with the button above."}
            />
          ) : (
            <DataTable
              columns={config.columns}
              rows={pageRows}
              onEdit={openEdit}
              onDelete={remove}
              sortKey={sortKey}
              sortAsc={sortAsc}
              onSort={toggleSort}
            />
          )}

          {/* pagination controls */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setPage(Math.max(0, safePage - 1))}
                disabled={safePage === 0}
                className="btn-outline !px-4 !py-2 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-xs text-slate-400">
                showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <button
                onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
                disabled={safePage >= pageCount - 1}
                className="btn-outline !px-4 !py-2 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {editing && (
          <div className="animate-fade-in animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <div className="glass-panel-light p-6 mt-6">
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
                  <button type="button" onClick={() => setEditing(null)} className="btn-outline">
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
