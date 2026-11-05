import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  FileSpreadsheet,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Ship,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { INITIAL_SALES_CONTRACTS, SalesContractRecord } from '../data/salesContractData';

const STATUS_FILTERS = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'On Water', value: 'ON WATER' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Packing Line', value: 'PACKING' },
  { label: 'Customs Hold', value: 'CUSTOMS HOLD' },
];

interface SalesContractsTableCardProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const SalesContractsTableCard: React.FC<SalesContractsTableCardProps> = ({ onShowToast }) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredContracts = INITIAL_SALES_CONTRACTS.filter((contract) => {
    const matchesSearch =
      contract.contractNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.dischargePort.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'ALL') return true;
    return contract.status === selectedFilter;
  });

  return (
    <Card padding="lg" className="w-full flex flex-col border border-border-subtle bg-white shadow-subtle">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Ship className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-content-main tracking-tight">
            Export Contracts & Manifests
          </h3>
        </div>
      </div>

      {/* Filters Bar: Self-Adapting Responsive Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="w-fit max-w-full overflow-x-auto no-scrollbar py-0.5">
          <CapsuleSegment
            options={STATUS_FILTERS}
            value={selectedFilter}
            onChange={setSelectedFilter}
            layoutId="sales-status-filter"
          />
        </div>

        <div className="w-full md:w-64 shrink-0">
          <Input
            placeholder="Search PO, buyer, port..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="w-3.5 h-3.5 text-content-muted stroke-[2.2]" />}
          />
        </div>
      </div>

      {/* Table Container with guaranteed overflow scrolling & fixed column widths */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted">
              <th className="py-2.5 pr-4 w-44">Contract & Buyer</th>
              <th className="py-2.5 px-3 w-32">Destination Port</th>
              <th className="py-2.5 px-3 w-32">Product Spec</th>
              <th className="py-2.5 px-3 w-24">Volume (MT)</th>
              <th className="py-2.5 px-3 w-28">FOB Value</th>
              <th className="py-2.5 pl-3 text-right w-28">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/70 text-xs">
            {filteredContracts.map((c) => {
              const isDelivered = c.status === 'DELIVERED';
              const isOnWater = c.status === 'ON WATER';
              const isPacking = c.status === 'PACKING';
              const isHold = c.status === 'CUSTOMS HOLD';

              return (
                <tr
                  key={c.id}
                  className="hover:bg-[#F8FAFC] transition-colors duration-150 group cursor-pointer"
                >
                  {/* Contract No & Buyer */}
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-bold text-content-main text-xs group-hover:text-[#00a7bc] transition-colors">
                        {c.contractNo}
                      </span>
                      <span className="text-[11px] text-content-muted">
                        {c.buyer} ({c.country})
                      </span>
                    </div>
                  </td>

                  {/* Destination Port & Liner */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-semibold text-content-main text-[11px]">
                        {c.dischargePort}
                      </span>
                      <span className="text-[10px] text-content-tertiary">
                        {c.liner}
                      </span>
                    </div>
                  </td>

                  {/* Product Spec & Grade */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-medium text-content-main text-[11px]">
                        {c.spec}
                      </span>
                      <span className="text-[10px] text-content-muted font-bold">
                        Grade {c.grade}
                      </span>
                    </div>
                  </td>

                  {/* Volume (MT) */}
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-content-main whitespace-nowrap">
                      {c.volumeMt} MT
                    </span>
                  </td>

                  {/* FOB Value */}
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-content-main whitespace-nowrap">
                      {c.fobPriceUsd}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 pl-3 text-right">
                    <div className="flex justify-end">
                      <Badge
                        variant={
                          isDelivered
                            ? 'success'
                            : isOnWater
                            ? 'brand'
                            : isPacking
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle text-xs text-content-muted">
        <span>Showing 1 to {filteredContracts.length} of 1,547 total export contracts</span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 h-7"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="px-2.5 py-1 text-[11px] font-bold text-content-main rounded-md bg-[#F4F5F8]">
            Page {page} of 194
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            className="px-2.5 h-7"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
