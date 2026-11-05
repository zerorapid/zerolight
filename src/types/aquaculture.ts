export type CulturePhase = 'Seed' | 'Grow-out' | 'Harvest';

export type HealthStatus = 'Normal' | 'Attention' | 'Critical';

export interface TelemetryRecord {
  id: string;
  date: string;
  pond: string;
  species: string;
  phase: CulturePhase;
  temp: number;
  do: number;
  ph: number;
  salinity: number;
  clarity: number;
  ammonia: number;
  nitrite: number;
  alkalinity: number;
  feed: number;
  fcr?: number;
  biomass: number;
  mortality: number;
  exchange: number;
  aeratorMode: string;
  additives: string[];
  tests: string[];
  condition: HealthStatus;
}

export type TelemetryFormData = Omit<TelemetryRecord, 'id' | 'condition'>;
