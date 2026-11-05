import React, { useState } from 'react';
import { Layers, Anchor, Store, ShoppingBag, CreditCard, CheckCircle2 } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export const SalesKpiRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Confirmed Orders */}
      <MetricCard
        title="Total Confirmed Orders"
        value="1,547"
        delta="+14.2%"
        isPositive={true}
        subtext="All channels"
        icon={<ShoppingBag className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" />}
      />

      {/* 2. Delivered Shipments */}
      <MetricCard
        title="Delivered Shipments"
        value="626"
        delta="+88 lots"
        isPositive={true}
        subtext="Port customs cleared"
        icon={<Store className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
      />

      {/* 3. On Water High-Seas Transit */}
      <MetricCard
        title="Reefer Cargo On Water"
        value="348"
        delta="18 Vessels"
        isPositive={false}
        subtext="Cold chain -18.4°C"
        icon={<Anchor className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
      />

      {/* 4. Realized Export Value */}
      <MetricCard
        title="Realized Export Value"
        value="₹42.8 Cr"
        delta="91.5% Settled"
        isPositive={false}
        subtext="LC irrevocable"
        icon={<CheckCircle2 className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
      />
    </div>
  );
};
