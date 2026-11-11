"use client";

import React, { useState, useMemo } from "react";
import {
  Home,
  Gift,
  Layers,
  Percent,
  Users,
  CreditCard,
  Settings,
  QrCode,
  HelpCircle,
  MessageSquare,
  X,
} from "lucide-react";
import {
  ZeroLightProvider,
  useZeroLight,
  Badge,
  Button,
  CopyTrigger,
  TrendDelta,
  Select,
  StatCard,
  AreaChart,
  DataTable,
  DataTableColumn,
  AppShell,
  NavSection,
} from "@/components/zerolight";

interface DonationRecord {
  id: string;
  submissionDate: string;
  donorName: string;
  isNewDonor?: boolean;
  claimMethod: "TITHE" | "OFFERING";
  giftAid: boolean;
  amount: number;
}

const PERIOD_DATA: Record<
  "this-month" | "last-month" | "last-90-days",
  {
    periodName: string;
    totalAmount: string;
    delta: number;
    newDonors: number;
    prevDonors: number;
    donorDeltaText: string;
    totalValue: string;
    prevValue: string;
    balanceAvailable: string;
    series: { label: string; value: number }[];
  }
> = {
  "this-month": {
    periodName: "March",
    totalAmount: "£ 12,296.00",
    delta: 14.22,
    newDonors: 345,
    prevDonors: 256,
    donorDeltaText: "up by 89",
    totalValue: "£ 41,850.00",
    prevValue: "from £ 38,580",
    balanceAvailable: "£ 3,996.00",
    series: [
      { label: "Mar 1", value: 1200 },
      { label: "Mar 3", value: 1200 },
      { label: "Mar 5", value: 3800 },
      { label: "Mar 7", value: 900 },
      { label: "Mar 9", value: 7400 },
      { label: "Mar 10", value: 3600 },
      { label: "Mar 12", value: 6800 },
      { label: "Mar 15", value: 9200 },
      { label: "Mar 18", value: 5100 },
      { label: "Mar 20", value: 6900 },
      { label: "Mar 23", value: 4200 },
      { label: "Mar 25", value: 8400 },
      { label: "Mar 28", value: 3100 },
      { label: "Mar 31", value: 6400 },
    ],
  },
  "last-month": {
    periodName: "February",
    totalAmount: "£ 10,765.00",
    delta: 8.4,
    newDonors: 256,
    prevDonors: 231,
    donorDeltaText: "up by 25",
    totalValue: "£ 38,580.00",
    prevValue: "from £ 35,120",
    balanceAvailable: "£ 2,840.00",
    series: [
      { label: "Feb 1", value: 1400 },
      { label: "Feb 5", value: 2900 },
      { label: "Feb 9", value: 4400 },
      { label: "Feb 12", value: 5100 },
      { label: "Feb 16", value: 6200 },
      { label: "Feb 20", value: 5700 },
      { label: "Feb 24", value: 7100 },
      { label: "Feb 28", value: 5900 },
    ],
  },
  "last-90-days": {
    periodName: "Q1 2026",
    totalAmount: "£ 33,490.00",
    delta: 19.65,
    newDonors: 882,
    prevDonors: 690,
    donorDeltaText: "up by 192",
    totalValue: "£ 112,430.00",
    prevValue: "from £ 93,950",
    balanceAvailable: "£ 11,420.00",
    series: [
      { label: "Jan 1", value: 3200 },
      { label: "Jan 15", value: 5900 },
      { label: "Feb 1", value: 4800 },
      { label: "Feb 15", value: 7600 },
      { label: "Mar 1", value: 6300 },
      { label: "Mar 15", value: 9200 },
      { label: "Mar 31", value: 8400 },
    ],
  },
};

const ALL_DONATIONS: DonationRecord[] = [
  { id: "don-1", submissionDate: "05 March 2022", donorName: "Anonymous", isNewDonor: true, claimMethod: "TITHE", giftAid: true, amount: 2300 },
  { id: "don-2", submissionDate: "22 March 2022", donorName: "Tim Brown", isNewDonor: true, claimMethod: "OFFERING", giftAid: true, amount: 100 },
  { id: "don-3", submissionDate: "23 March 2022", donorName: "Joe Smith", claimMethod: "TITHE", giftAid: false, amount: 190 },
  { id: "don-4", submissionDate: "25 March 2022", donorName: "Sam Smith", claimMethod: "TITHE", giftAid: false, amount: 540 },
  { id: "don-5", submissionDate: "25 March 2022", donorName: "Jane Lee", claimMethod: "OFFERING", giftAid: true, amount: 1300 },
  { id: "don-6", submissionDate: "26 March 2022", donorName: "Tim Brown", isNewDonor: true, claimMethod: "OFFERING", giftAid: true, amount: 250 },
  { id: "don-7", submissionDate: "30 March 2022", donorName: "Jane Lee", claimMethod: "OFFERING", giftAid: true, amount: 1300 },
  { id: "don-8", submissionDate: "31 March 2022", donorName: "Elena Cruz", isNewDonor: true, claimMethod: "TITHE", giftAid: true, amount: 820 },
  { id: "don-9", submissionDate: "31 March 2022", donorName: "Marcus Bell", claimMethod: "OFFERING", giftAid: false, amount: 440 },
];

export function DonationsInner() {
  const { tokens } = useZeroLight();
  const [activeRoute, setActiveRoute] = useState<string>("overview");
  const [period, setPeriod] = useState<"this-month" | "last-month" | "last-90-days">("this-month");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  const activeData = PERIOD_DATA[period];
  const visibleRows = showAllRows ? ALL_DONATIONS : ALL_DONATIONS.slice(0, 7);

  const navSections: NavSection[] = useMemo(
    () => [
      {
        title: "Donations",
        items: [
          {
            id: "overview",
            label: "Overview",
            icon: <Home className="w-4 h-4" />,
            active: activeRoute === "overview",
            onClick: () => setActiveRoute("overview"),
          },
          {
            id: "donations",
            label: "Donations",
            icon: <Gift className="w-4 h-4" />,
            active: activeRoute === "donations",
            onClick: () => setActiveRoute("donations"),
          },
          {
            id: "donation-types",
            label: "Donation types",
            icon: <Layers className="w-4 h-4" />,
            active: activeRoute === "donation-types",
            onClick: () => setActiveRoute("donation-types"),
          },
          {
            id: "gift-aid",
            label: "Gift Aid",
            icon: <Percent className="w-4 h-4" />,
            active: activeRoute === "gift-aid",
            onClick: () => setActiveRoute("gift-aid"),
            children: [
              {
                id: "gift-aid-unclaimed",
                label: "Unclaimed",
                active: activeRoute === "gift-aid-unclaimed",
                onClick: () => setActiveRoute("gift-aid-unclaimed"),
              },
              {
                id: "gift-aid-history",
                label: "History",
                active: activeRoute === "gift-aid-history",
                onClick: () => setActiveRoute("gift-aid-history"),
              },
            ],
          },
          {
            id: "donors",
            label: "Donors",
            icon: <Users className="w-4 h-4" />,
            active: activeRoute === "donors",
            onClick: () => setActiveRoute("donors"),
          },
        ],
      },
      {
        title: "Account",
        items: [
          {
            id: "stripe",
            label: "Stripe account",
            icon: <CreditCard className="w-4 h-4" />,
            external: true,
            active: activeRoute === "stripe",
            onClick: () => setActiveRoute("stripe"),
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="w-4 h-4" />,
            active: activeRoute === "settings",
            onClick: () => setActiveRoute("settings"),
          },
        ],
      },
    ],
    [activeRoute]
  );

  const columns: DataTableColumn<DonationRecord>[] = useMemo(
    () => [
      {
        key: "submissionDate",
        header: "Submission Date",
        render: (row) => (
          <span className="text-neutral-500 font-medium tabular-nums">
            {row.submissionDate}
          </span>
        ),
      },
      {
        key: "donorName",
        header: "Donor Name",
        render: (row) => (
          <div className="inline-flex items-center gap-2">
            <span style={{ color: tokens.textIconColor }} className="font-medium">
              {row.donorName}
            </span>
            {row.isNewDonor && (
              <Badge variant="info" showDot={false} size="xs">
                New donor
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "claimMethod",
        header: "Claim Method",
        render: (row) => (
          <Badge
            variant={row.claimMethod === "TITHE" ? "lime" : "lilac"}
            showDot={false}
            size="xs"
          >
            {row.claimMethod}
          </Badge>
        ),
      },
      {
        key: "giftAid",
        header: "Gift Aid",
        render: (row) =>
          row.giftAid ? (
            <Badge variant="indigo" showDot={false} size="xs">
              GIFT AID
            </Badge>
          ) : null,
      },
      {
        key: "amount",
        header: "Donation Amount",
        align: "right",
        render: (row) => (
          <span style={{ color: tokens.textIconColor }} className="font-medium tabular-nums">
            £ {row.amount.toFixed(2)}
          </span>
        ),
      },
    ],
    [tokens.textIconColor]
  );

  const [wholePart, decimalPart] = activeData.totalAmount.split(".");

  return (
    <AppShell
      brandName="Stewardship"
      hideHeader
      hideCollapseToggle
      activeIndicator="left-bar"
      accentColor="#2563EB"
      navSections={navSections}
      sidebarWidgets={
        <div className="space-y-2 px-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Unique ID
          </div>
          <div className="px-2 flex items-center justify-between gap-2">
            <CopyTrigger text="d1a9bb15" variant="ghost" className="px-1.5 py-1" />
          </div>
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            style={{ color: tokens.textIconColor }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium opacity-75 hover:opacity-100 rounded-md transition-opacity cursor-pointer"
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span>Get QR code</span>
          </button>
        </div>
      }
      footerAction={
        <div className="space-y-1 text-xs">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-2 py-1 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer text-left"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Get help</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-2 py-1 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer text-left"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact us</span>
          </button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header with Inline Period Filter Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <h1
            style={{ color: tokens.textIconColor }}
            className="text-xl font-bold tracking-tight"
          >
            Overview
          </h1>
          <Select
            inline
            size="sm"
            value={period}
            onChange={(v) => setPeriod(v as "this-month" | "last-month" | "last-90-days")}
            options={[
              { value: "this-month", label: "This month" },
              { value: "last-month", label: "Last month" },
              { value: "last-90-days", label: "Last 90 days" },
            ]}
          />
        </div>

        {/* Hero Asymmetric Split: Line Chart Left + 3 Stacked Horizontal StatCards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-7 flex">
            <AreaChart
              className="w-full"
              title="Total donation amount"
              headerMeta={activeData.periodName}
              curve="linear"
              showArea={false}
              showLegend={false}
              primaryColor="#1D4ED8"
              primaryLabel="Donations"
              height={210}
              data={activeData.series}
              valueFormatter={(v) => `£ ${v.toLocaleString()}`}
              yAxisFormatter={(v) => (v === 0 ? "0" : `${Math.round(v / 1000)}k`)}
              kpiHeader={
                <div className="flex flex-wrap items-baseline gap-3">
                  <div
                    style={{ color: tokens.textIconColor }}
                    className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight"
                  >
                    <span>{wholePart}</span>
                    {decimalPart && (
                      <span className="text-base font-medium opacity-70">
                        .{decimalPart}
                      </span>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <TrendDelta value={activeData.delta} size="xs" showSign={false} />
                    <span className="text-xs text-neutral-400 font-medium">
                      vs last month
                    </span>
                  </div>
                </div>
              }
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
            <StatCard
              layout="horizontal"
              label="Number of new unique donors"
              value={activeData.newDonors}
              subValue={`from ${activeData.prevDonors}`}
              delta={activeData.donorDeltaText}
              comparisonText=""
              trend="up"
            />
            <StatCard
              layout="horizontal"
              label="Total donation value"
              value={activeData.totalValue}
              subValue={activeData.prevValue}
              minorDecimal
              deltaPill={
                <div className="inline-flex items-center gap-1.5">
                  <TrendDelta value={activeData.delta} size="xs" showSign={false} />
                  <span className="text-xs text-neutral-400 font-medium">
                    vs last month
                  </span>
                </div>
              }
            />
            <StatCard
              layout="horizontal"
              label="Total Balance available"
              value={activeData.balanceAvailable}
              minorDecimal
            />
          </div>
        </div>

        {/* Recent Donations Generic DataTable */}
        <section className="space-y-3 pt-1">
          <h2
            style={{ color: tokens.textIconColor }}
            className="text-sm font-bold tracking-tight"
          >
            Recent donations
          </h2>
          <DataTable<DonationRecord>
            columns={columns}
            rows={visibleRows}
            rowKey={(r) => r.id}
            selectable
            footerAction={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllRows((prev) => !prev)}
                className="!text-blue-600 hover:!bg-blue-50/60"
              >
                {showAllRows ? "Show fewer donations" : "All donations"}
              </Button>
            }
          />
        </section>
      </div>

      {/* Lightweight QR Preview Modal */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
          onClick={() => setIsQrModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Donation QR Code"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: tokens.universalFillColor,
              borderColor: tokens.universalBorderColor,
              color: tokens.textIconColor,
            }}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-xl font-sans"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-semibold tracking-tight">Donation QR Code</h3>
                <p className="text-xs mt-1 opacity-65">
                  Share this QR code or unique donation ID (d1a9bb15) so donors can contribute directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                aria-label="Close modal"
                style={{ color: tokens.textIconColor }}
                className="p-1.5 rounded-lg opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 flex flex-col items-center gap-3">
              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
                <QrCode className="w-24 h-24 text-neutral-900" strokeWidth={1.5} />
              </div>
              <CopyTrigger text="https://give.zerolight.dev/d1a9bb15" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setIsQrModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export function DonationsView() {
  return (
    <ZeroLightProvider>
      <DonationsInner />
    </ZeroLightProvider>
  );
}
