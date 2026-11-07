import EmptyState from "./EmptyState";

interface DataTableProps {
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  sortKey?: string;
  sortAsc?: boolean;
  onSort?: (key: string) => void;
}

export default function DataTable({ columns, rows, onEdit, onDelete, sortKey, sortAsc, onSort }: DataTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <EmptyState title="Nothing here yet" />
      </div>
    );
  }
  const hasControls = Boolean(onEdit || onDelete);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={onSort ? () => onSort(col.key) : undefined}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none ${
                    onSort ? "cursor-pointer hover:text-brand-600" : ""
                  }`}
                >
                  {col.label}
                  {onSort && sortKey === col.key && <span className="ml-1 text-brand-600">{sortAsc ? "↑" : "↓"}</span>}
                </th>
              ))}
              {hasControls && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, idx) => (
              <tr key={String(row.id ?? idx)} className="hover:bg-brand-50/40 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-slate-700">
                    {formatCell(row[col.key])}
                  </td>
                ))}
                {hasControls && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {onEdit && (
                      <button
                        className="text-brand-600 hover:underline text-sm font-medium"
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="text-rose-600 hover:underline text-sm font-medium ml-3"
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
