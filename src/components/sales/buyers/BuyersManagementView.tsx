import React, { useState } from 'react';
import { BuyerListTableCard } from './BuyerListTableCard';
import { AddBuyerModal } from './AddBuyerFormCard';
import { INITIAL_BUYERS, BuyerRecord } from './data/buyersData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { Building2, ArrowLeft } from 'lucide-react';

interface BuyersManagementViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

const BUYER_SUB_TABS = [
  { label: 'Buyer List', value: 'Buyer List' },
  { label: 'Consignee List', value: 'Consignee List' },
  { label: 'Notify Party List', value: 'Notify Party List' },
  { label: 'Applicant List', value: 'Applicant List' },
  { label: 'Brands List', value: 'Brands List' },
];

export const BuyersManagementView: React.FC<BuyersManagementViewProps> = ({
  onShowToast,
}) => {
  const [buyers, setBuyers] = useState<BuyerRecord[]>(INITIAL_BUYERS);
  const [activeSubTab, setActiveSubTab] = useState<string>('Buyer List');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRecord | null>(null);

  const handleAddNew = () => {
    setSelectedBuyer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (buyer: BuyerRecord) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const target = buyers.find((b) => b.id === id);
    setBuyers((prev) => prev.filter((b) => b.id !== id));
    onShowToast?.(`Deleted buyer record: ${target?.buyerName || id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBuyer(null);
  };

  const handleSave = (buyerData: Omit<BuyerRecord, 'id'>, id?: number) => {
    if (id) {
      // Edit existing
      setBuyers((prev) =>
        prev.map((b) => (b.id === id ? { ...buyerData, id } : b))
      );
      onShowToast?.(`Updated buyer: ${buyerData.buyerName}`);
    } else {
      // Add new
      const nextId =
        buyers.length > 0 ? Math.max(...buyers.map((b) => b.id)) + 1 : 1;
      const newRecord: BuyerRecord = {
        ...buyerData,
        id: nextId,
      };
      setBuyers((prev) => [newRecord, ...prev]);
      onShowToast?.(`Created new buyer: ${buyerData.buyerName}`);
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Level 3 Sub-Tabs: Placed OUTSIDE and on TOP of the card container */}
      <div className="w-fit max-w-full overflow-x-auto no-scrollbar py-0.5">
        <CapsuleSegment
          options={BUYER_SUB_TABS}
          value={activeSubTab}
          onChange={setActiveSubTab}
          layoutId="buyer-sub-tabs-global"
        />
      </div>

      {/* 2. Main Container Content */}
      {activeSubTab === 'Buyer List' ? (
        <BuyerListTableCard
          buyers={buyers}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Card padding="lg" className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white border border-border-subtle text-center shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0B0F19] shadow-xs">
            <Building2 className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-content-main tracking-tight">
            {activeSubTab} Directory
          </h3>
          <p className="text-xs font-medium text-content-muted max-w-md">
            International trade registry for {activeSubTab.toLowerCase()}. Use Buyer List to inspect and configure verified export purchasers.
          </p>
          <Button
            variant="black"
            size="sm"
            onClick={() => setActiveSubTab('Buyer List')}
            className="mt-2"
            icon={<ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />}
          >
            Return to Buyer List
          </Button>
        </Card>
      )}

      {/* 3. Add / Edit Buyer Modal Dialog (Popup over the view) */}
      <AddBuyerModal
        isOpen={isModalOpen}
        initialData={selectedBuyer}
        onSave={handleSave}
        onClose={handleCloseModal}
        onShowToast={onShowToast}
      />
    </div>
  );
};
