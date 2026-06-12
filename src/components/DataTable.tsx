import { ReactNode } from "react";

type DataTableProps<T> = {
  columns: string[];
  rows: T[];
  renderRow: (row: T) => ReactNode;
  title: string;
  subtitle: string;
  emptyMessage?: string;
};

export function DataTable<T>({
  columns,
  rows,
  renderRow,
  title,
  subtitle,
  emptyMessage = "No records available.",
}: DataTableProps<T>) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          <p className="muted">{subtitle}</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map(renderRow)
            ) : (
              <tr>
                <td className="empty-cell" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
