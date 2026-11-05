import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
} from 'lucide-react';
import { BuyerRecord } from './data/buyersData';

interface BuyerListTableCardProps {
  buyers: BuyerRecord[];
  onAddNew: () => void;
  onEdit: (buyer: BuyerRecord) => void;
  onDelete?: (id: number) => void;
}

export const BuyerListTableCard: React.FC<BuyerListTableCardProps> = ({
  buyers,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filtered Records
  const filteredBuyers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return buyers;
    return buyers.filter((b) => {
      return (
        b.buyerName.toLowerCase().includes(q) ||
        b.buyerAddress.toLowerCase().includes(q) ||
        b.buyerCountry.toLowerCase().includes(q) ||
        (b.emailId && b.emailId.toLowerCase().includes(q)) ||
        (b.buyerCode && b.buyerCode.toLowerCase().includes(q)) ||
        (b.contactPerson && b.contactPerson.toLowerCase().includes(q))
      );
    });
  }, [buyers, searchQuery]);

  // Pagination slice
  const totalRecords = filteredBuyers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBuyers = useMemo(() => {
    return filteredBuyers.slice(startIndex, startIndex + pageSize);
  }, [filteredBuyers, startIndex, pageSize]);

  return (
    <Card padding="lg" className="w-full flex flex-col border border-border-subtle bg-white shadow-subtle">
      {/* 1. Header Row: Title, Total Badge, Search Bar & Direct CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-content-main tracking-tight">
              Buyers Directory & Ledgers
            </h3>
            <span className="text-xs font-semibold text-content-muted bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
              {buyers.length} Registered
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search buyers, country, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              startIcon={<Search className="w-3.5 h-3.5 text-content-muted stroke-[2.2]" />}
              inputSize="sm"
            />
          </div>

          <Button
            variant="black"
            size="sm"
            onClick={onAddNew}
            icon={<Plus className="w-3.5 h-3.5 stroke-[2.2]" />}
          >
            New Buyer
          </Button>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted">
              <th className="py-2.5 pr-4 w-52">Buyer Name & Code</th>
              <th className="py-2.5 px-3 w-32">Country</th>
              <th className="py-2.5 px-3 w-60">Buyer Address</th>
              <th className="py-2.5 px-3 w-48">Contact & Email</th>
              <th className="py-2.5 px-3 w-36">Regulatory / Tax</th>
              <th className="py-2.5 pl-3 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/70 text-xs">
            {paginatedBuyers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-content-muted">
                  No buyers match the query &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              paginatedBuyers.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-[#F8FAFC] transition-colors duration-150 group cursor-pointer"
                  onClick={() => onEdit(b)}
                >
                  {/* Buyer Name & Code */}
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-content-main text-xs group-hover:text-[#00a7bc] transition-colors">
                        {b.buyerName}
                      </span>
                      <span className="text-[11px] text-content-muted font-medium">
                        {b.buyerCode || `ID #${b.id}`}
                      </span>
                    </div>
                  </td>

                  {/* Destination Country */}
                  <td className="py-3.5 px-3">
                    <Badge variant="secondary" size="sm" className="font-semibold text-content-main uppercase">
                      {b.buyerCountry}
                    </Badge>
                  </td>

                  {/* Buyer Address */}
                  <td className="py-3.5 px-3">
                    <span className="text-xs text-content-muted font-normal line-clamp-1 max-w-[240px]">
                      {b.buyerAddress}
                    </span>
                  </td>

                  {/* Contact & Email */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-content-main text-[11px] flex items-center gap-1">
                        <User className="w-3 h-3 text-content-tertiary shrink-0" />
                        {b.contactPerson || 'Unassigned'}
                      </span>
                      <span className="text-[11px] text-content-muted flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-content-tertiary shrink-0" />
                        <span className="truncate max-w-[180px]">{b.emailId || '—'}</span>
                      </span>
                    </div>
                  </td>

                  {/* Regulatory / Tax */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col text-[11px]">
                      {b.irsNumber ? (
                        <span className="text-content-main font-medium">IRS: {b.irsNumber}</span>
                      ) : b.usciCode ? (
                        <span className="text-content-main font-medium">USCI: {b.usciCode}</span>
                      ) : b.iftpCode ? (
                        <span className="text-content-main font-medium">IFTP: {b.iftpCode}</span>
                      ) : (
                        <span className="text-content-tertiary">—</span>
                      )}
                      {(b.stateForUsa || b.zipcodeForUsa) && (
                        <span className="text-content-muted text-[10px]">
                          {[b.stateForUsa, b.zipcodeForUsa].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(b)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-content-muted hover:text-content-main hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Buyer"
                      >
                        <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(b.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-content-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Buyer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Table Footer: Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border-subtle/70 text-xs text-content-muted mt-2">
        <span>
          Showing {totalRecords > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + pageSize, totalRecords)} of {totalRecords} total buyers
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
          </Button>
          <span className="font-semibold text-content-main px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
