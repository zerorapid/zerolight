import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { DatePickerPopover } from '@/components/ui/DatePickerPopover';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

interface SalesFiltersBarProps {
  onSearch?: () => void;
}

const EXPORTER_OPTIONS = [
  'DEVI FISHERIES LIMITED',
  'DEVI SEAFOODS VIZAG',
  'AQUAFLOW ENTERPRISE EXPORTS',
];

const CONSIGNEE_OPTIONS = [
  'All',
  'Pacific Seafood (US)',
  'Nordic Marine Imports (EU)',
  'Yokohama Marine Corp (JP)',
  'Great Ocean Foods (UK)',
];

const BRAND_OPTIONS = [
  'All',
  'Devi Gold Premium',
  'Ocean Pearl IQF',
  'Vannamei Classic Block',
];

const COUNTRY_OPTIONS = [
  'All',
  'U.S.A',
  'CHINA',
  'BELGIUM',
  'RUSSIA',
  'CANADA',
  'UNITED KINGDOM',
  'JAPAN',
];

const YEAR_OPTIONS = ['FY 2026-2027', 'FY 2025-2026', 'FY 2024-2025'];

export const SalesFiltersBar: React.FC<SalesFiltersBarProps> = ({ onSearch }) => {
  const [exporter, setExporter] = useState('DEVI FISHERIES LIMITED');
  const [consignee, setConsignee] = useState('All');
  const [brand, setBrand] = useState('All');
  const [country, setCountry] = useState('All');
  const [year, setYear] = useState('FY 2026-2027');
  const [fromDate, setFromDate] = useState('Apr 01, 2026');
  const [toDate, setToDate] = useState('Mar 31, 2027');

  return (
    <div className="bg-white rounded-card p-5 border border-border-subtle shadow-subtle">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 items-end">
        {/* Exporter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">Exporter:</label>
          <SearchableSelect
            options={EXPORTER_OPTIONS}
            value={exporter}
            onChange={setExporter}
            placeholder="Select exporter"
          />
        </div>

        {/* Consignee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">Consignee:</label>
          <SearchableSelect
            options={CONSIGNEE_OPTIONS}
            value={consignee}
            onChange={setConsignee}
            placeholder="Select consignee"
          />
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">Brand:</label>
          <SearchableSelect
            options={BRAND_OPTIONS}
            value={brand}
            onChange={setBrand}
            placeholder="Select brand"
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">Country:</label>
          <SearchableSelect
            options={COUNTRY_OPTIONS}
            value={country}
            onChange={setCountry}
            placeholder="Select country"
          />
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">Year:</label>
          <SearchableSelect
            options={YEAR_OPTIONS}
            value={year}
            onChange={setYear}
            placeholder="Select year"
          />
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">From Date:</label>
          <DatePickerPopover value={fromDate} onChange={setFromDate} />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-content-muted">To Date:</label>
          <DatePickerPopover value={toDate} onChange={setToDate} />
        </div>
      </div>

      {/* Centered Search Button using Design System ShimmerButton */}
      <div className="flex justify-center mt-4 pt-4 border-t border-border-subtle">
        <ShimmerButton
          size="sm"
          onClick={onSearch}
          className="px-8 h-9 text-xs font-bold"
          icon={<Search className="w-3.5 h-3.5 stroke-[2.4]" />}
        >
          Search Analytics
        </ShimmerButton>
      </div>
    </div>
  );
};
