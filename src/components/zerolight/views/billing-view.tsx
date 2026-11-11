"use client";

import React, { useState } from "react";
import {
  DashboardTemplate,
  StatCard,
  PaymentCard,
  Badge,
  Button,
  ConfirmationModal,
  DetailDrawer,
  ProgressBar,
} from "@/components/zerolight";
import {
  Download,
  Plus,
  CheckCircle2,
  FileText,
  ArrowUpRight,
} from "lucide-react";

interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  date: string;
  amount: string;
  cardBrand: string;
  cardLast4: string;
  status: "Paid" | "Pending";
}

const INVOICES: InvoiceRecord[] = [
  {
    id: "inv-01",
    invoiceNo: "INV-2026-1102",
    date: "01 Nov 2026",
    amount: "$4,850.00",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "Paid",
  },
  {
    id: "inv-02",
    invoiceNo: "INV-2026-1001",
    date: "01 Oct 2026",
    amount: "$4,850.00",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "Paid",
  },
  {
    id: "inv-03",
    invoiceNo: "INV-2026-0901",
    date: "01 Sep 2026",
    amount: "$3,600.00",
    cardBrand: "Mastercard",
    cardLast4: "8891",
    status: "Paid",
  },
  {
    id: "inv-04",
    invoiceNo: "INV-2026-0801",
    date: "01 Aug 2026",
    amount: "$3,600.00",
    cardBrand: "Mastercard",
    cardLast4: "8891",
    status: "Paid",
  },
];

export function BillingView() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardTemplate
        title="Subscription & Billing Hub"
        subtitle="Manage tier subscriptions, payment methods, seat quotas and tax invoice history."
        statusIndicator={
          <Badge variant="healthy">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enterprise Tier • Active</span>
            </span>
          </Badge>
        }
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            iconLeft={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => setIsUpgradeModalOpen(true)}
          >
            Change Tier
          </Button>
        }
        secondaryActions={
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download className="w-3.5 h-3.5" />}
            onClick={() => {}}
          >
            Export Invoices
          </Button>
        }
        metrics={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <StatCard
              label="MONTHLY COMMIT"
              value="$4,850.00"
              delta="Renews Dec 1"
              trend="neutral"
              comparisonText="via auto-debit"
            />
            <StatCard
              label="SEAT ALLOCATION"
              value="38 / 50"
              delta="76% utilized"
              trend="up"
              comparisonText="12 seats available"
            />
            <StatCard
              label="SAVED CARDS"
              value="2 Active"
              delta="Visa default"
              trend="neutral"
              comparisonText="ending in 4242"
            />
            <StatCard
              label="COMPLIANCE RATING"
              value="SOC-2 Type II"
              delta="Audited"
              trend="up"
              comparisonText="Valid thru 2027"
            />
          </div>
        }
        primaryWidget={
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Saved Payment Methods</h3>
                <p className="text-xs text-neutral-500">ZeroLight PCI-DSS Level 1 Encrypted Vault</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddCardOpen(true)}
              >
                Add Card
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PaymentCard
                brand="visa"
                last4="4242"
                cardholder="SARAH CONNOR"
                expiry="08/29"
                isDefault={true}
              />
              <PaymentCard
                brand="mastercard"
                last4="8891"
                cardholder="SARAH CONNOR"
                expiry="11/27"
                isDefault={false}
              />
            </div>
          </div>
        }
        secondaryWidget={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Resource Quota Burn</h3>
            <div className="space-y-3 p-4 bg-white rounded-xl border border-neutral-200/70 shadow-2xs">
              <ProgressBar label="Active Seat Licenses (38/50)" value={76} />
              <ProgressBar label="API Key Quota (14/20)" value={70} />
              <ProgressBar label="Monthly Ingress Quota (3.4TB/5.0TB)" value={68} />
            </div>
          </div>
        }
        dataSection={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Invoice Statement History</h3>
              <span className="text-xs text-neutral-500">Auto-generated monthly tax receipts</span>
            </div>
            <div className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Invoice Number</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Billing Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Charge Amount</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Charged To</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {INVOICES.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{inv.invoiceNo}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{inv.date}</td>
                      <td className="py-3 px-4 font-bold tabular-nums text-neutral-900">{inv.amount}</td>
                      <td className="py-3 px-4 text-neutral-600 font-sans">
                        {inv.cardBrand} •••• {inv.cardLast4}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="healthy">{inv.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" iconLeft={<Download className="w-3 h-3" />}>
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
        progressiveDisclosure={
          <>
            <DetailDrawer
              isOpen={selectedInvoice !== null}
              onClose={() => setSelectedInvoice(null)}
              title={selectedInvoice?.invoiceNo || "Invoice Details"}
              subtitle={`Billed on ${selectedInvoice?.date} • Amount: ${selectedInvoice?.amount}`}
              footer={
                <div className="flex items-center justify-between w-full">
                  <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />}>
                    Download PDF
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setSelectedInvoice(null)}>
                    Close
                  </Button>
                </div>
              }
            >
              {selectedInvoice && (
                <div className="space-y-4 text-xs text-neutral-600">
                  <div className="p-3 bg-neutral-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Invoice ID</span>
                      <span className="font-semibold text-neutral-900">{selectedInvoice.invoiceNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Billed</span>
                      <span className="font-bold text-neutral-900">{selectedInvoice.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Status</span>
                      <Badge variant="healthy">{selectedInvoice.status}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </DetailDrawer>

            <ConfirmationModal
              isOpen={isUpgradeModalOpen}
              onClose={() => setIsUpgradeModalOpen(false)}
              onConfirm={() => setIsUpgradeModalOpen(false)}
              title="Modify Workspace Subscription"
              description="Switch between Starter, Pro, and Enterprise license tiers. Changes take effect on the next billing date."
              confirmButtonText="Confirm Upgrade"
              verificationPhrase="CONFIRM"
            />

            <ConfirmationModal
              isOpen={isAddCardOpen}
              onClose={() => setIsAddCardOpen(false)}
              onConfirm={() => setIsAddCardOpen(false)}
              title="Add Secure Credit Card"
              description="Enter your 16-digit primary corporate debit or credit card. ZeroLight does not store raw numbers on disk."
              confirmButtonText="Authorize Card"
              verificationPhrase="CONFIRM"
            />
          </>
        }
      />
    </div>
  );
}
