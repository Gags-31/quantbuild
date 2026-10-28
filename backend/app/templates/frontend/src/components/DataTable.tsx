interface DataTableProps {
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
}

export default function DataTable({ columns, rows, onEdit, onDelete }: DataTableProps) {
  if (rows.length === 0) {
    return <div className="flex flex-col items-center justify-center py-12 text-center"><EmptyState /> </div>;
  }
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={String(row.id)} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-slate-700">
                  {formatCell(row[col.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
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
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

import EmptyState from "./EmptyState";
