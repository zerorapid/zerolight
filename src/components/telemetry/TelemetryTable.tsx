import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import * as Popover from '@radix-ui/react-popover';
import { TelemetryRecord, HealthStatus } from '@/types/aquaculture';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, ChevronDown, Trash2, ArrowUpDown, Table as TableIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TelemetryTableProps {
  data: TelemetryRecord[];
  onUpdateRow: (id: string, updates: Partial<TelemetryRecord>) => void;
  onDeleteRow: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const TelemetryTable: React.FC<TelemetryTableProps> = ({
  data,
  onUpdateRow,
  onDeleteRow,
  onShowToast,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== 'ALL' && item.condition !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [data, statusFilter]);

  const columns = useMemo<ColumnDef<TelemetryRecord>[]>(
    () => [
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-content-main uppercase text-[11px] font-bold tracking-wider"
          >
            Date
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-content-muted text-xs">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'pond',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-content-main uppercase text-[11px] font-bold tracking-wider"
          >
            Pond
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <strong>{info.getValue() as string}</strong>,
      },
      {
        accessorKey: 'species',
        header: 'Species',
        cell: (info) => {
          const val = info.getValue() as string;
          return <span>{val.split('(')[0].trim()}</span>;
        },
      },
      {
        accessorKey: 'phase',
        header: 'Phase',
        cell: (info) => (
          <span className="text-xs font-semibold">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'temp',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-content-main uppercase text-[11px] font-bold tracking-wider"
          >
            Temp
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <input
            type="number"
            step="0.1"
            value={row.original.temp}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onUpdateRow(row.original.id, { temp: val });
            }}
            className="w-16 h-7 px-2 rounded-full border border-border-subtle bg-transparent text-xs font-semibold focus:border-brand-accent focus:bg-white outline-none"
          />
        ),
      },
      {
        accessorKey: 'do',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-content-main uppercase text-[11px] font-bold tracking-wider"
          >
            D.O.
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <input
            type="number"
            step="0.1"
            value={row.original.do}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                const condition = val < 4.5 ? 'Critical' : val < 5.5 ? 'Attention' : 'Normal';
                onUpdateRow(row.original.id, { do: val, condition });
              }
            }}
            className="w-16 h-7 px-2 rounded-full border border-border-subtle bg-transparent text-xs font-semibold focus:border-brand-accent focus:bg-white outline-none"
          />
        ),
      },
      {
        accessorKey: 'ph',
        header: 'pH',
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.ph.toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'salinity',
        header: 'Salinity',
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.salinity} ppt</span>
        ),
      },
      {
        accessorKey: 'biomass',
        header: 'Biomass',
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.biomass.toLocaleString()} kg</span>
        ),
      },
      {
        accessorKey: 'feed',
        header: 'Daily Feed',
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.feed} kg</span>
        ),
      },
      {
        accessorKey: 'additives',
        header: 'Additives',
        cell: ({ row }) => {
          const list = row.original.additives || [];
          if (list.length === 0) return <span className="text-content-tertiary">&mdash;</span>;
          return (
            <div className="flex flex-wrap gap-1 max-w-[160px]">
              {list.map((add) => (
                <span
                  key={add}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-subtle text-content-muted"
                >
                  {add}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'tests',
        header: 'Diagnostics',
        cell: ({ row }) => {
          const list = row.original.tests || [];
          if (list.length === 0) return <span className="text-content-tertiary">&mdash;</span>;
          return (
            <span className="text-[11px] text-content-muted font-semibold">
              {list.join(', ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'condition',
        header: 'Condition',
        cell: ({ row }) => {
          const condition = row.original.condition;
          const badgeVariant =
            condition === 'Normal'
              ? 'success'
              : condition === 'Attention'
              ? 'warning'
              : 'error';

          return (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="border-none bg-transparent cursor-pointer inline-flex items-center gap-1 transition-opacity hover:opacity-85"
                >
                  <Badge variant={badgeVariant} size="sm">
                    <span>{condition}</span>
                    <ChevronDown className="w-2.5 h-2.5 ml-1 stroke-[2.2]" />
                  </Badge>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 min-w-[120px] bg-white border border-border-subtle rounded-cluster p-1.5 shadow-floating outline-none duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:duration-150 data-[state=closed]:ease-in animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 will-change-[transform,opacity]"
                  align="start"
                  sideOffset={4}
                >
                  {(['Normal', 'Attention', 'Critical'] as HealthStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateRow(row.original.id, { condition: st })}
                      className="w-full px-3 py-1.5 rounded-full text-xs font-semibold text-left text-content-main hover:bg-surface-subtle transition-all duration-150 ease-out cursor-pointer active:scale-[0.98]"
                    >
                      {st}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                onDeleteRow(row.original.id);
                onShowToast(`Deleted record for ${row.original.pond}.`);
              }}
              title="Delete record"
              className="w-8 h-8 rounded-full border-none bg-transparent text-content-muted hover:text-status-error hover:bg-status-error-tint cursor-pointer inline-flex items-center justify-center transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        ),
      },
    ],
    [onUpdateRow, onDeleteRow, onShowToast]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card padding="lg" className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div className="text-base font-bold flex items-center gap-2.5 tracking-tight text-content-main">
          <TableIcon className="w-4 h-4 text-brand-accent stroke-[2.4]" />
          <span>Telemetry Logs & Real-Time Node Status</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Global Search Pill using unified Input with ⌘K badge */}
          <div className="w-[240px] sm:w-[280px] relative flex items-center">
            <Input
              variant="default"
              inputSize="sm"
              startIcon={<Search className="w-3.5 h-3.5 text-content-muted" />}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search ponds, species..."
            />
            {!globalFilter && (
              <span className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-content-tertiary bg-surface-subtle border border-border-subtle/80 pointer-events-none select-none">
                ⌘K
              </span>
            )}
          </div>

          {/* Condition Filter Popover */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="h-9 px-4 bg-white border border-border-subtle rounded-full text-xs font-semibold text-content-main flex items-center justify-between gap-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#94A3B8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer outline-none focus-visible:border-[#0B0F19] focus-visible:shadow-[0_0_0_3px_rgba(11,15,25,0.08)]"
              >
                <span>{statusFilter === 'ALL' ? 'All Conditions' : statusFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-content-muted stroke-[2.2] transition-transform duration-200" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-50 min-w-[130px] bg-white border border-border-subtle rounded-cluster p-1.5 shadow-floating outline-none duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:duration-150 data-[state=closed]:ease-in animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 will-change-[transform,opacity]"
                align="end"
                sideOffset={4}
              >
                {['ALL', 'Normal', 'Attention', 'Critical'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      'w-full px-3 py-1.5 rounded-full text-xs font-semibold text-left transition-all duration-150 ease-out cursor-pointer active:scale-[0.98]',
                      statusFilter === st
                        ? 'bg-brand-tint text-brand-accent'
                        : 'text-content-main hover:bg-surface-subtle hover:translate-x-0.5'
                    )}
                  >
                    {st === 'ALL' ? 'All States' : st}
                  </button>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* Responsive Table Viewport with Soft Corners & Hidden Scrollbar */}
      <div className="overflow-x-auto rounded-cluster border border-border-subtle no-scrollbar">
        <table className="w-full border-collapse text-[13px] text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-[#F8FAFC] text-content-muted text-[11px] font-bold tracking-[0.05em] uppercase px-4 py-3 border-b border-border-subtle whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-content-muted py-8 text-sm"
                >
                  No matching aquaculture records located.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F9FAFC] transition-colors border-b border-border-subtle last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 font-medium whitespace-nowrap align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-2 text-xs text-content-muted">
        <div>
          Showing {table.getRowModel().rows.length} of {filteredData.length} records
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="px-1 font-semibold">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};
