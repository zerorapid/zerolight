export interface SalesContractRecord {
  id: string;
  contractNo: string;
  buyer: string;
  country: string;
  spec: string;
  grade: string;
  volumeMt: number;
  fobPriceUsd: string;
  etdDate: string;
  dischargePort: string;
  liner: string;
  status: 'DELIVERED' | 'ON WATER' | 'PACKING' | 'CUSTOMS HOLD';
}

export const INITIAL_SALES_CONTRACTS: SalesContractRecord[] = [
  {
    id: 'SC-101',
    contractNo: 'PO-US-8921',
    buyer: 'Pacific Seafood LLC',
    country: 'U.S.A',
    spec: 'Vannamei HLSO IQF',
    grade: '26/30',
    volumeMt: 48.5,
    fobPriceUsd: '$345,000',
    etdDate: 'Oct 24, 2026',
    dischargePort: 'LOS ANGELES',
    liner: 'MAERSK LINE',
    status: 'ON WATER',
  },
  {
    id: 'SC-102',
    contractNo: 'PO-US-8922',
    buyer: 'Eastern Fish Company',
    country: 'U.S.A',
    spec: 'Raw Peeled Deveined (PD)',
    grade: '21/25',
    volumeMt: 52.0,
    fobPriceUsd: '$418,000',
    etdDate: 'Oct 18, 2026',
    dischargePort: 'SAVANNAH',
    liner: 'MSC LINE',
    status: 'DELIVERED',
  },
  {
    id: 'SC-103',
    contractNo: 'PO-EU-4412',
    buyer: 'Nordic Marine Imports',
    country: 'BELGIUM',
    spec: 'Cooked Tail-on (CPTO)',
    grade: '31/35',
    volumeMt: 32.4,
    fobPriceUsd: '$285,000',
    etdDate: 'Oct 28, 2026',
    dischargePort: 'ANTWERP',
    liner: 'CMA CGM',
    status: 'PACKING',
  },
  {
    id: 'SC-104',
    contractNo: 'PO-CN-3301',
    buyer: 'Zhejiang Ocean Gateway',
    country: 'CHINA',
    spec: 'Head-on Shell-on (HOSO)',
    grade: '41/50',
    volumeMt: 84.0,
    fobPriceUsd: '$540,000',
    etdDate: 'Oct 22, 2026',
    dischargePort: 'SHANGHAI',
    liner: 'COSCO SHIPPING',
    status: 'ON WATER',
  },
  {
    id: 'SC-105',
    contractNo: 'PO-JP-7714',
    buyer: 'Yokohama Marine Corp',
    country: 'JAPAN',
    spec: 'Nobashi Sushi Grade',
    grade: '20/40',
    volumeMt: 28.0,
    fobPriceUsd: '$312,000',
    etdDate: 'Oct 12, 2026',
    dischargePort: 'BUSAN',
    liner: 'ONE OCEAN',
    status: 'DELIVERED',
  },
  {
    id: 'SC-106',
    contractNo: 'PO-UK-9020',
    buyer: 'Great Ocean Foods Ltd',
    country: 'UNITED KINGDOM',
    spec: 'IQF Peeled Tail-Off',
    grade: '16/20',
    volumeMt: 24.5,
    fobPriceUsd: '$210,000',
    etdDate: 'Nov 02, 2026',
    dischargePort: 'FELIXSTOWE',
    liner: 'HAPAG-LLOYD',
    status: 'PACKING',
  },
  {
    id: 'SC-107',
    contractNo: 'PO-CA-1105',
    buyer: 'Montreal Seafood Depot',
    country: 'CANADA',
    spec: 'Easy-Peel Split (EZP)',
    grade: '26/30',
    volumeMt: 38.0,
    fobPriceUsd: '$290,000',
    etdDate: 'Oct 15, 2026',
    dischargePort: 'MONTREAL',
    liner: 'MSC LINE',
    status: 'DELIVERED',
  },
  {
    id: 'SC-108',
    contractNo: 'PO-RU-6619',
    buyer: 'Baltic Fisheries Coldstore',
    country: 'RUSSIA',
    spec: 'Block Frozen Vannamei',
    grade: '51/60',
    volumeMt: 44.0,
    fobPriceUsd: '$260,000',
    etdDate: 'Oct 29, 2026',
    dischargePort: 'VLADIVOSTOK',
    liner: 'FESCO',
    status: 'CUSTOMS HOLD',
  },
];
