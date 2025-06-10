import { cn } from '../../../lib/utils';

interface TableProps {
  columns: string[];
  data: Array<Record<string, React.ReactNode>>;
  className?: string;
  emptyMessage?: string;
}

export function Table({ columns, data, className, emptyMessage = 'No data found.' }: TableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-700', className)}>
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left font-medium text-neutral-700 dark:text-neutral-200">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800'}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-neutral-800 dark:text-neutral-100">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
