import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { telemetrySchema, TelemetrySchemaType } from '@/lib/validations/telemetry';
import { TelemetryRecord } from '@/types/aquaculture';
import { ClusterCard } from './ClusterCard';
import { FieldWrapper } from './FieldWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { TagInput } from '@/components/ui/TagInput';
import { DatePickerPopover } from '@/components/ui/DatePickerPopover';
import { MapPin, Droplets, ShieldAlert, Package, Check, SlidersHorizontal } from 'lucide-react';

interface TelemetryFormProps {
  onSubmitRecord: (record: TelemetryRecord) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

const SPECIES_OPTIONS = [
  'P. vannamei (Pacific White Shrimp)',
  'P. monodon (Black Tiger Shrimp)',
  'O. niloticus (Nile Tilapia)',
  'L. calcarifer (Barramundi)',
  'Salmo salar (Atlantic Salmon)',
];

const AERATOR_OPTIONS = [
  'Automated VFD Surge',
  'Continuous 100% High Flow',
  'Night Jet Aeration (18kW)',
  'Solar-Hybrid Daytime',
];

const DIAGNOSTICS_OPTIONS = [
  { label: 'Vibrio TCBS Count', value: 'Vibrio Plate' },
  { label: 'Microalgae Density', value: 'Microalgae' },
  { label: 'Heavy Metals ICP', value: 'Heavy Metals' },
  { label: 'WSSV / EHP PCR Screen', value: 'WSSV PCR' },
  { label: 'Ca/Mg Hardness Ratio', value: 'Total Hardness' },
];

const DEFAULT_FORM_VALUES: TelemetrySchemaType = {
  pond: 'Pond 04',
  species: 'P. vannamei (Pacific White Shrimp)',
  date: 'Oct 29, 2026',
  phase: 'Grow-out',
  temp: 28.4,
  do: 6.5,
  ph: 7.85,
  salinity: 18,
  clarity: 35,
  ammonia: 0.12,
  nitrite: 0.03,
  alkalinity: 140,
  feed: 230,
  fcr: 1.28,
  biomass: 8400,
  mortality: 6,
  exchange: 10,
  aeratorMode: 'Automated VFD Surge',
  additives: ['B. subtilis', 'Molasses'],
  tests: ['Vibrio Plate', 'Microalgae'],
};

export const TelemetryForm: React.FC<TelemetryFormProps> = ({
  onSubmitRecord,
  onShowToast,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TelemetrySchemaType>({
    resolver: zodResolver(telemetrySchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = (data: TelemetrySchemaType) => {
    const condition = data.do < 4.5 ? 'Critical' : data.do < 5.5 ? 'Attention' : 'Normal';
    const newRecord: TelemetryRecord = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ...data,
      condition,
    };
    onSubmitRecord(newRecord);
    onShowToast(`Telemetry for ${newRecord.pond} committed successfully.`);
  };

  const onError = () => {
    onShowToast('Please correct highlighted input errors.', 'error');
  };

  const handleReset = () => {
    reset(DEFAULT_FORM_VALUES);
    onShowToast('Form reset to default parameters.');
  };

  return (
    <Card padding="lg" className="w-full">
      {/* Title Header with Clean Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
        <div className="text-base font-bold flex items-center gap-2.5 tracking-tight text-content-main">
          <SlidersHorizontal className="w-4 h-4 text-[#0B0F19] stroke-[2.4]" />
          <span>Real-Time Telemetry Dosing & Water Record</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-700 tracking-wide bg-slate-100/90 border border-slate-200/70 px-3 py-1 rounded-pill">
          Zone: Sector Alpha &bull; Live Sensor Gateway
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet/laptop, 4 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* CLUSTER 1: LOCATION & SPECIES (Indigo Accent) */}
          <ClusterCard
            badgeText="1. Location & Species"
            badgeIcon={<MapPin className="w-3.5 h-3.5 stroke-[2.2]" />}
            accentColor="indigo"
          >
            {/* Field 1: Pond ID */}
            <FieldWrapper label="Pond ID" error={errors.pond?.message}>
              <Input
                type="text"
                {...register('pond')}
                placeholder="e.g. Pond 04"
                isError={!!errors.pond}
              />
            </FieldWrapper>

            {/* Field 2: Target Species Searchable Select */}
            <FieldWrapper label="Target Species" error={errors.species?.message}>
              <Controller
                name="species"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={SPECIES_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    searchPlaceholder="Filter species..."
                    hasError={!!errors.species}
                  />
                )}
              />
            </FieldWrapper>

            {/* Field 3: Log Date Picker */}
            <FieldWrapper label="Log Date" error={errors.date?.message}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePickerPopover
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldWrapper>

            {/* Field 4: Culture Phase Segmented Control */}
            <FieldWrapper label="Culture Phase" error={errors.phase?.message}>
              <Controller
                name="phase"
                control={control}
                render={({ field }) => (
                  <CapsuleSegment
                    options={[
                      { label: 'Seed', value: 'Seed' },
                      { label: 'Grow', value: 'Grow-out' },
                      { label: 'Harvest', value: 'Harvest' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldWrapper>

            {/* Field 5: Standing Biomass */}
            <FieldWrapper label="Standing Biomass" error={errors.biomass?.message}>
              <Input
                type="number"
                step="100"
                {...register('biomass')}
                isError={!!errors.biomass}
                unit="kg"
              />
            </FieldWrapper>
          </ClusterCard>

          {/* CLUSTER 2: WATER TELEMETRY (Ocean Cyan Accent) */}
          <ClusterCard
            badgeText="2. Water Quality"
            badgeIcon={<Droplets className="w-3.5 h-3.5 stroke-[2.2]" />}
            accentColor="ocean"
          >
            {/* Field 6: Temp */}
            <FieldWrapper label="Water Temp" error={errors.temp?.message}>
              <Input
                type="number"
                step="0.1"
                {...register('temp')}
                isError={!!errors.temp}
                unit="°C"
              />
            </FieldWrapper>

            {/* Field 7: Dissolved Oxygen */}
            <FieldWrapper label="Dissolved Oxygen" error={errors.do?.message}>
              <Input
                type="number"
                step="0.1"
                {...register('do')}
                isError={!!errors.do}
                unit="mg/L"
              />
            </FieldWrapper>

            {/* Field 8: pH */}
            <FieldWrapper label="Water pH" error={errors.ph?.message}>
              <Input
                type="number"
                step="0.05"
                {...register('ph')}
                isError={!!errors.ph}
                unit="pH"
              />
            </FieldWrapper>

            {/* Field 9: Salinity */}
            <FieldWrapper label="Salinity" error={errors.salinity?.message}>
              <Input
                type="number"
                step="1"
                {...register('salinity')}
                isError={!!errors.salinity}
                unit="ppt"
              />
            </FieldWrapper>

            {/* Field 10: Secchi Clarity */}
            <FieldWrapper label="Secchi Clarity" error={errors.clarity?.message}>
              <Input
                type="number"
                step="1"
                {...register('clarity')}
                isError={!!errors.clarity}
                unit="cm"
              />
            </FieldWrapper>
          </ClusterCard>

          {/* CLUSTER 3: CHEMISTRY & DIAGNOSTICS (Bio-Emerald Accent) */}
          <ClusterCard
            badgeText="3. Chemistry & Tests"
            badgeIcon={<ShieldAlert className="w-3.5 h-3.5 stroke-[2.2]" />}
            accentColor="emerald"
          >
            {/* Field 11: TAN */}
            <FieldWrapper label="Ammonia (TAN)" error={errors.ammonia?.message}>
              <Input
                type="number"
                step="0.01"
                {...register('ammonia')}
                isError={!!errors.ammonia}
                unit="mg/L"
              />
            </FieldWrapper>

            {/* Field 12: Nitrite */}
            <FieldWrapper label="Nitrite (NO2)" error={errors.nitrite?.message}>
              <Input
                type="number"
                step="0.01"
                {...register('nitrite')}
                isError={!!errors.nitrite}
                unit="mg/L"
              />
            </FieldWrapper>

            {/* Field 13: Alkalinity */}
            <FieldWrapper label="Total Alkalinity" error={errors.alkalinity?.message}>
              <Input
                type="number"
                step="5"
                {...register('alkalinity')}
                isError={!!errors.alkalinity}
                unit="ppm"
              />
            </FieldWrapper>

            {/* Field 14: Laboratory Tests Multi-Select */}
            <FieldWrapper label="Laboratory Tests Executed" error={errors.tests?.message}>
              <Controller
                name="tests"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={DIAGNOSTICS_OPTIONS}
                    values={field.value}
                    onChange={field.onChange}
                    searchPlaceholder="Search tests..."
                  />
                )}
              />
            </FieldWrapper>

            {/* Field 15: Mortality */}
            <FieldWrapper label="Daily Mortality Loss" error={errors.mortality?.message}>
              <Input
                type="number"
                step="1"
                {...register('mortality')}
                isError={!!errors.mortality}
                unit="heads"
              />
            </FieldWrapper>
          </ClusterCard>

          {/* CLUSTER 4: FEEDING & EQUIPMENT (Warm Solar Amber Accent) */}
          <ClusterCard
            badgeText="4. Feeding & Power"
            badgeIcon={<Package className="w-3.5 h-3.5 stroke-[2.2]" />}
            accentColor="amber"
          >
            {/* Field 16: Feed Ration */}
            <FieldWrapper label="Daily Feed Ration" error={errors.feed?.message}>
              <Input
                type="number"
                step="1"
                {...register('feed')}
                isError={!!errors.feed}
                unit="kg/d"
              />
            </FieldWrapper>

            {/* Field 17: Water Turnover Exchange */}
            <FieldWrapper label="Water Exchange Rate" error={errors.exchange?.message}>
              <Input
                type="number"
                step="1"
                {...register('exchange')}
                isError={!!errors.exchange}
                unit="% vol"
              />
            </FieldWrapper>

            {/* Field 18: Target Feed Conversion Ratio */}
            <FieldWrapper label="Target FCR Efficiency" error={errors.fcr?.message}>
              <Input
                type="number"
                step="0.05"
                {...register('fcr')}
                isError={!!errors.fcr}
                unit="FCR"
              />
            </FieldWrapper>

            {/* Field 19: Aerator Profile */}
            <FieldWrapper label="Aeration Equipment Mode" error={errors.aeratorMode?.message}>
              <Controller
                name="aeratorMode"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={AERATOR_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    searchPlaceholder="Search profiles..."
                  />
                )}
              />
            </FieldWrapper>

            {/* Field 20: Additives Multi-Chip */}
            <FieldWrapper label="Probiotics & Minerals (Enter)" error={errors.additives?.message}>
              <Controller
                name="additives"
                control={control}
                render={({ field }) => (
                  <TagInput
                    tags={field.value}
                    onChange={field.onChange}
                    placeholder="Add..."
                  />
                )}
              />
            </FieldWrapper>
          </ClusterCard>
        </div>

        {/* Action Buttons Row with Informative Left Status Anchor */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-border-subtle/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-content-muted">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>20/20 Aquaculture Parameters Active &bull; Zero-Latency In-Memory Storage</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset Defaults
            </Button>
            <ShimmerButton type="submit" icon={<Check className="w-3.5 h-3.5 stroke-[2.4]" />}>
              Commit & Log Telemetry
            </ShimmerButton>
          </div>
        </div>
      </form>
    </Card>
  );
};
