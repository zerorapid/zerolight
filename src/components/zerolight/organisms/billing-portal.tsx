"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import {
  CreditCard,
  Download,
  Plus,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building,
  Lock,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { StatCard } from "../molecules/stat-card";
import { PaymentCard } from "../atoms/payment-card";
import { ProgressBar } from "../atoms/progress-bar";
import { Modal } from "./modal";
import { DetailDrawer } from "./detail-drawer";

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  date: string;
  amount: string;
  paymentMethod: string;
  cardBrand: "Visa" | "Mastercard" | "Amex";
  cardLast4: string;
  status: "Paid" | "Pending" | "Refunded";
  items: { description: string; qty: number; unitPrice: string; total: string }[];
  subtotal: string;
  tax: string;
}

export interface BillingTier {
  id: "starter" | "growth" | "enterprise";
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  isCurrent?: boolean;
  recommended?: boolean;
}

export interface BillingPortalProps {
  currentTierId?: "starter" | "growth" | "enterprise";
  invoices?: InvoiceItem[];
  className?: string;
  onUpgradeTier?: (tierId: string, cycle: "monthly" | "annual") => void;
  onDownloadInvoice?: (invoice: InvoiceItem) => void;
}

const DEFAULT_TIERS: BillingTier[] = [
  {
    id: "starter",
    name: "Starter Team",
    priceMonthly: 49,
    priceAnnual: 39,
    description: "Dedicated workspace for early-stage teams launching first apps.",
    features: ["Up to 5 team seats", "50,000 API calls/mo", "Community support SLA", "Single region deployment"],
  },
  {
    id: "growth",
    name: "Growth Scaler",
    priceMonthly: 199,
    priceAnnual: 159,
    description: "High-throughput infrastructure for expanding venture-backed scaleups.",
    features: ["Up to 25 team seats", "1,000,000 API calls/mo", "99.9% uptime SLA", "Dual-region redundancy", "Dedicated Slack connect"],
  },
  {
    id: "enterprise",
    name: "Enterprise Dedicated",
    priceMonthly: 485,
    priceAnnual: 388,
    description: "Custom compliance, isolated single-tenant compute, and 24/7 dedicated engineering.",
    features: ["Unlimited team seats", "Unlimited API rate quotas", "99.99% uptime SLA", "SOC-2 & ISO-27001 vault", "Dedicated solution architect"],
    isCurrent: true,
    recommended: true,
  },
];

const DEFAULT_INVOICES: InvoiceItem[] = [
  {
    id: "inv-2026-11",
    invoiceNo: "INV-2026-1102",
    date: "01 Nov 2026",
    amount: "$4,850.00",
    paymentMethod: "Visa ending in 4242",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "Paid",
    subtotal: "$4,110.17",
    tax: "$739.83",
    items: [
      { description: "Enterprise Dedicated Cluster (Monthly)", qty: 1, unitPrice: "$3,880.00", total: "$3,880.00" },
      { description: "Additional Seat Licenses (Pool of 10)", qty: 2, unitPrice: "$115.08", total: "$230.17" },
      { description: "Egress Ingress Bandwidth Overages (1.2TB)", qty: 1, unitPrice: "$0.00", total: "$0.00" },
    ],
  },
  {
    id: "inv-2026-10",
    invoiceNo: "INV-2026-1001",
    date: "01 Oct 2026",
    amount: "$4,850.00",
    paymentMethod: "Visa ending in 4242",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "Paid",
    subtotal: "$4,110.17",
    tax: "$739.83",
    items: [
      { description: "Enterprise Dedicated Cluster (Monthly)", qty: 1, unitPrice: "$3,880.00", total: "$3,880.00" },
      { description: "Additional Seat Licenses (Pool of 10)", qty: 2, unitPrice: "$115.08", total: "$230.17" },
    ],
  },
  {
    id: "inv-2026-09",
    invoiceNo: "INV-2026-0901",
    date: "01 Sep 2026",
    amount: "$3,600.00",
    paymentMethod: "Mastercard ending in 8891",
    cardBrand: "Mastercard",
    cardLast4: "8891",
    status: "Paid",
    subtotal: "$3,050.85",
    tax: "$549.15",
    items: [
      { description: "Growth Scaler Cluster (Monthly)", qty: 1, unitPrice: "$3,050.85", total: "$3,050.85" },
    ],
  },
];

export function BillingPortal({
  currentTierId = "enterprise",
  invoices = DEFAULT_INVOICES,
  className = "",
  onUpgradeTier,
  onDownloadInvoice,
}: BillingPortalProps) {
  const { tokens, scaled } = useZeroLight();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedTierForModal, setSelectedTierForModal] = useState<string>(currentTierId);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const activeTier = DEFAULT_TIERS.find((t) => t.id === currentTierId) || DEFAULT_TIERS[2];

  const handleDownload = (inv: InvoiceItem) => {
    if (onDownloadInvoice) {
      onDownloadInvoice(inv);
    }
    setDownloadSuccessToast(`Receipt ${inv.invoiceNo}.pdf downloaded`);
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div
          role="status"
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            boxShadow: scaled.cardShadow,
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-neutral-900 border animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Zone 1: Header & Key Metrics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Subscription & Billing Hub
            </h2>
            <Badge variant="healthy">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{activeTier.name} • Active</span>
              </span>
            </Badge>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            PCI-DSS Level 1 compliant settlement with auto-generated tax receipts and instant SLA enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<FileText className="w-3.5 h-3.5" />}
            onClick={() => handleDownload(invoices[0])}
          >
            Latest Tax Receipt
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => setIsTierModalOpen(true)}
          >
            Change Subscription Plan
          </Button>
        </div>
      </div>

      {/* Zone 1 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="COMMITTED RUN RATE"
          value="$4,850.00"
          delta="Renews Dec 1"
          trend="neutral"
          comparisonText="Auto-debit via Primary Visa"
        />
        <StatCard
          label="SEAT UTILIZATION"
          value="38 / 50"
          delta="76% occupied"
          trend="up"
          comparisonText="12 licenses unallocated"
        />
        <StatCard
          label="API INGRESS BANDWIDTH"
          value="3.4 / 5.0 TB"
          delta="68% threshold"
          trend="neutral"
          comparisonText="1.6 TB headroom remaining"
        />
        <StatCard
          label="COMPLIANCE ATTESTATION"
          value="SOC-2 Type II"
          delta="Verified"
          trend="up"
          comparisonText="ISO 27001 & HIPAA ready"
        />
      </div>

      {/* Zone 2: Two-Column Operational Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Payment Methods & Active Plan Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Plan & Card Container */}
          <div
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="p-5 border space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Current Plan & Settlement</h3>
                <p className="text-xs text-neutral-500">Billed annually on the 1st of each calendar cycle.</p>
              </div>
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    billingCycle === "monthly" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    billingCycle === "annual" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Saved Payment Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Verified Payment Methods
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(true)}
                  className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentCard
                  brand="visa"
                  last4="4242"
                  cardholder="SARAH CONNOR"
                  expiry="08/29"
                  isDefault={true}
                  variant="dark"
                />
                <PaymentCard
                  brand="mastercard"
                  last4="8891"
                  cardholder="SARAH CONNOR"
                  expiry="11/27"
                  isDefault={false}
                  variant="gradient"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>ZeroLight PCI-DSS Level 1 Encrypted Hardware Security Module (HSM)</span>
              </span>
              <span className="font-semibold text-neutral-700">Next Auto-Charge: 01 Dec 2026</span>
            </div>
          </div>

          {/* Statement History Table */}
          <div
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="p-5 border space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Tax Invoices & Audit Receipts</h3>
                <p className="text-xs text-neutral-500">Directly downloadable for accounting & finance teams.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleDownload(invoices[0])}
              >
                Export All (.zip)
              </Button>
            </div>

            <div className="overflow-x-auto border border-neutral-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Billing Date</th>
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Amount</th>
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Payment Source</th>
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" />
                        <span>{inv.invoiceNo}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{inv.date}</td>
                      <td className="py-3 px-4 font-bold tabular-nums text-neutral-900 font-sans">{inv.amount}</td>
                      <td className="py-3 px-4 text-neutral-600 font-sans">
                        {inv.cardBrand} •••• {inv.cardLast4}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={inv.status === "Paid" ? "healthy" : "degraded"}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(inv);
                          }}
                          className="text-neutral-500 hover:text-neutral-900 font-semibold p-1 hover:bg-neutral-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Usage Quotas Burn & Enterprise Entitlements */}
        <div className="space-y-6">
          {/* Quota Burn Card */}
          <div
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="p-5 border space-y-4"
          >
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Resource Quotas</h3>
                <p className="text-xs text-neutral-500">Live cluster burn in current cycle</p>
              </div>
              <Badge variant="healthy">Normal</Badge>
            </div>

            <div className="space-y-3.5">
              <ProgressBar label="Active Seat Licenses (38/50)" value={76} />
              <ProgressBar label="API Key Credentials (14/20)" value={70} />
              <ProgressBar label="Data Egress Bandwidth (3.4TB/5.0TB)" value={68} />
              <ProgressBar label="Concurrent Build Runners (8/10)" value={80} />
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => setIsTierModalOpen(true)}
              >
                Request Quota Increase
              </Button>
            </div>
          </div>

          {/* SLA & Security Entitlements Card */}
          <div
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="p-5 border space-y-4"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900">Enterprise Assurances</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>99.99% Uptime Guarantee</strong> backed by contractual financial SLA credits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Dedicated Virtual Private Cloud (VPC)</strong> peering and isolated KMS keys.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>24/7/365 PagerDuty Escalation</strong> with 15-minute engineer response time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Annual Penetration Test Reports</strong> by independent CREST-certified auditors.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Security Officer: sec-team@zerolight.io</span>
              <a href="#compliance" className="hover:underline text-neutral-600 flex items-center gap-0.5">
                Audit Vault <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 3: Progressive Disclosure Drawers & Modals */}

      {/* Invoice Detail Drawer */}
      <DetailDrawer
        isOpen={selectedInvoice !== null}
        onClose={() => setSelectedInvoice(null)}
        title={selectedInvoice?.invoiceNo || "Invoice Breakdown"}
        subtitle={`Issued on ${selectedInvoice?.date} • Total: ${selectedInvoice?.amount}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              iconLeft={<Download className="w-3.5 h-3.5" />}
              onClick={() => selectedInvoice && handleDownload(selectedInvoice)}
            >
              Download PDF Receipt
            </Button>
            <Button variant="primary" size="sm" onClick={() => setSelectedInvoice(null)}>
              Done
            </Button>
          </div>
        }
      >
        {selectedInvoice && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-neutral-50 rounded-lg space-y-2 border border-neutral-100">
              <div className="flex justify-between">
                <span className="text-neutral-500">Invoice Reference:</span>
                <span className="font-semibold text-neutral-900">{selectedInvoice.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date of Settlement:</span>
                <span className="text-neutral-700">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Instrument:</span>
                <span className="text-neutral-700">{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Settlement Status:</span>
                <Badge variant={selectedInvoice.status === "Paid" ? "healthy" : "degraded"}>
                  {selectedInvoice.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-900">Line Items</h4>
              <div className="border border-neutral-100 rounded-lg overflow-hidden divide-y divide-neutral-100">
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{item.description}</p>
                      <p className="text-[11px] text-neutral-400">Qty: {item.qty} × {item.unitPrice}</p>
                    </div>
                    <span className="font-bold tabular-nums text-neutral-900">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal (Net):</span>
                <span className="tabular-nums">{selectedInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tax (18% GST / VAT Applicable):</span>
                <span className="tabular-nums">{selectedInvoice.tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Total Amount Charged:</span>
                <span className="tabular-nums">{selectedInvoice.amount}</span>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Plan Upgrade / Tier Selection Modal */}
      <Modal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        title="Upgrade or Switch Subscription Tier"
        description="Transparent compute pricing with guaranteed SLAs and no hidden overage penalties."
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  billingCycle === "monthly" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">20% Off</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEFAULT_TIERS.map((tier) => {
              const price = billingCycle === "annual" ? tier.priceAnnual : tier.priceMonthly;
              const isSelected = selectedTierForModal === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierForModal(tier.id)}
                  style={{
                    borderRadius: `${scaled.scaledCardRadius}px`,
                    borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                    borderWidth: isSelected ? "2px" : `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                  }}
                  className={`p-4 border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected ? "shadow-md" : "hover:border-neutral-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{tier.name}</span>
                      {tier.isCurrent && <Badge variant="neutral">Current</Badge>}
                    </div>
                    <div>
                      <div className="text-2xl font-bold tabular-nums text-neutral-900">
                        ${price}
                        <span className="text-xs font-normal text-neutral-500">/seat/mo</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{tier.description}</p>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-neutral-600 pt-2 border-t border-neutral-100">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100">
                    <Button
                      variant={isSelected ? "primary" : "outline"}
                      size="sm"
                      className="w-full justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUpgradeTier) onUpgradeTier(tier.id, billingCycle);
                        setIsTierModalOpen(false);
                      }}
                    >
                      {tier.isCurrent ? "Active Plan" : `Select ${tier.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
            <Button variant="ghost" size="sm" onClick={() => setIsTierModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Payment Card Modal */}
      <Modal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        title="Add Secure Payment Instrument"
        description="End-to-end tokenized via ZeroLight HSM with zero plaintext card numbers on application servers."
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsAddCardOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              required
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                maxLength={19}
                required
                className="w-full px-3 py-2 pl-9 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-sans tabular-nums"
              />
              <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="08/29"
                maxLength={5}
                required
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-sans tabular-nums"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">CVC / CVV</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                required
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-sans tabular-nums"
              />
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center gap-2 text-neutral-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted with AES-256 before leaving your browser. Protected by Visa Secure & Mastercard Identity Check.</span>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Encrypted Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
