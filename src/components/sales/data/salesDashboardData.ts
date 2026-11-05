export interface SalesKpiMetric {
  id: string;
  label: string;
  value: string;
  iconType: 'contracts' | 'water' | 'delivered' | 'orders' | 'pendingPayments' | 'paymentsReceived';
  change?: string;
  isPositive?: boolean;
}

export const SALES_KPI_METRICS: SalesKpiMetric[] = [
  { id: '1', label: 'Pending Contracts', value: '573', iconType: 'contracts', change: '+14% vs Q3', isPositive: true },
  { id: '2', label: 'On Water', value: '348', iconType: 'water', change: '18 Vessels Active', isPositive: true },
  { id: '3', label: 'Delivered', value: '626', iconType: 'delivered', change: '+88 Lots Dispatched', isPositive: true },
  { id: '4', label: 'Orders', value: '1,547', iconType: 'orders', change: 'US & EU Fulfillment', isPositive: true },
  { id: '5', label: 'Pending Payments', value: '360', iconType: 'pendingPayments', change: 'LC Clearance 12d', isPositive: false },
  { id: '6', label: 'Payments Received', value: '614', iconType: 'paymentsReceived', change: '₹42.8 Cr Settled', isPositive: true },
];

export const MONTHLY_INVOICE_DATA = [
  { month: 'April', invoiced: 168, shipments: 182 },
  { month: 'May', invoiced: 154, shipments: 162 },
  { month: 'June', invoiced: 172, shipments: 188 },
  { month: 'July', invoiced: 198, shipments: 204 },
  { month: 'August', invoiced: 170, shipments: 180 },
  { month: 'September', invoiced: 110, shipments: 115 },
  { month: 'October', invoiced: 8, shipments: 12 },
  { month: 'November', invoiced: 4, shipments: 6 },
  { month: 'December', invoiced: 5, shipments: 5 },
  { month: 'January', invoiced: 6, shipments: 8 },
  { month: 'February', invoiced: 4, shipments: 6 },
  { month: 'March', invoiced: 8, shipments: 10 },
];

export const PLANT_WISE_ORDERS = [
  { unit: 'Unit 1(UEB)', total: 68, shipped: 58, pending: 10 },
  { unit: 'Unit 2(ST)', total: 245, shipped: 190, pending: 55 },
  { unit: 'Unit 3(NVG)', total: 310, shipped: 240, pending: 70 },
  { unit: 'Unit 4(VZM)', total: 350, shipped: 260, pending: 90 },
  { unit: 'Unit 5(KKD)', total: 680, shipped: 410, pending: 270 },
  { unit: 'Unit 6(SKP)', total: 280, shipped: 210, pending: 70 },
  { unit: 'All', total: 1933, shipped: 1368, pending: 565 },
];

export const COUNTRY_DISTRIBUTION = [
  { name: 'United States', percentage: 71.07, count: 476, color: '#00a7bc' },
  { name: 'China', percentage: 14.51, count: 89, color: '#0B0F19' },
  { name: 'Belgium', percentage: 3.12, count: 21, color: '#1E293B' },
  { name: 'Russia', percentage: 2.38, count: 16, color: '#334155' },
  { name: 'Canada', percentage: 1.78, count: 12, color: '#475569' },
  { name: 'Other Markets', percentage: 7.14, count: 39, color: '#94A3B8' },
];

export const PORT_DISTRIBUTION = [
  { name: 'Los Angeles', count: 142, color: '#00a7bc' },
  { name: 'Savannah', count: 121, color: '#0B0F19' },
  { name: 'New York', count: 110, color: '#1E293B' },
  { name: 'Antwerp', count: 48, color: '#334155' },
  { name: 'Busan', count: 36, color: '#475569' },
  { name: 'Other Ports', count: 169, color: '#94A3B8' },
];

export const SIZE_GRADE_COMPARISON = [
  { grade: '(BROKEN)', toBeShipped: 4.2, shipped: 18.5 },
  { grade: '4/6', toBeShipped: 1.5, shipped: 8.2 },
  { grade: '6/8', toBeShipped: 2.1, shipped: 12.4 },
  { grade: '8/12', toBeShipped: 5.6, shipped: 24.1 },
  { grade: '12/15', toBeShipped: 8.9, shipped: 38.6 },
  { grade: '16/20', toBeShipped: 12.4, shipped: 52.0 },
  { grade: '18/22', toBeShipped: 9.8, shipped: 41.5 },
  { grade: '20/40', toBeShipped: 15.2, shipped: 64.8 },
  { grade: '21/25', toBeShipped: 18.6, shipped: 82.0 },
  { grade: '26/30', toBeShipped: 485.0, shipped: 320.0 }, // Peak grade
  { grade: '31/35', toBeShipped: 28.4, shipped: 94.2 },
  { grade: '36/40', toBeShipped: 32.1, shipped: 110.5 },
  { grade: '41/50', toBeShipped: 44.0, shipped: 125.8 },
  { grade: '51/60', toBeShipped: 38.2, shipped: 98.4 },
  { grade: '61/70', toBeShipped: 24.6, shipped: 76.1 },
  { grade: '71/90', toBeShipped: 18.9, shipped: 58.2 },
  { grade: '90/120', toBeShipped: 12.0, shipped: 42.0 },
  { grade: '100/200', toBeShipped: 8.4, shipped: 28.5 },
  { grade: '200/300', toBeShipped: 4.1, shipped: 16.0 },
];

export const FREIGHT_RATE_SERIES = [
  { date: '30-08-2026', maersk: 9860, msc: 7707, cma: 7164.69, evergreen: 6701, hapag: 6145 },
  { date: '04-09-2026', maersk: 10500, msc: 8337, cma: 7164.69, evergreen: 6701, hapag: 6145 },
  { date: '10-09-2026', maersk: 7200, msc: 5400, cma: 7164.69, evergreen: 4800, hapag: 6145 },
  { date: '16-09-2026', maersk: 120, msc: 80, cma: 7164.69, evergreen: 60, hapag: 6145 },
];
