/**
 * Exact minor-unit monetary arithmetic (integer cents/paise) to avoid floating-point drift
 * across LineItemMatrix, LedgerBalancer, ThreeWayMatch, and BillingPortal.
 */

export function toMinorUnits(amount: number): number {
  return Math.round((Number.isFinite(amount) ? amount : 0) * 100);
}

export function fromMinorUnits(minor: number): number {
  return Math.round(minor) / 100;
}

export function computeLineTotals(qty: number, unitPrice: number, taxPct: number) {
  const safeQty = Number.isFinite(qty) ? qty : 0;
  const unitMinor = toMinorUnits(unitPrice);
  const netMinor = Math.round(safeQty * unitMinor);
  const taxMinor = Math.round((netMinor * (Number.isFinite(taxPct) ? taxPct : 0)) / 100);
  const grossMinor = netMinor + taxMinor;
  return {
    netMinor,
    taxMinor,
    grossMinor,
    net: fromMinorUnits(netMinor),
    tax: fromMinorUnits(taxMinor),
    gross: fromMinorUnits(grossMinor),
  };
}

export function summarizeLineItems(
  items: Array<{ qty: number; unitPrice: number; taxPct: number }>
) {
  let subtotalMinor = 0;
  let taxMinor = 0;
  for (const item of items) {
    const line = computeLineTotals(item.qty, item.unitPrice, item.taxPct);
    subtotalMinor += line.netMinor;
    taxMinor += line.taxMinor;
  }
  const grandTotalMinor = subtotalMinor + taxMinor;
  return {
    subtotal: fromMinorUnits(subtotalMinor),
    taxTotal: fromMinorUnits(taxMinor),
    grandTotal: fromMinorUnits(grandTotalMinor),
  };
}
