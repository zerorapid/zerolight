import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/input/Input';
import { SearchSelect } from '../atoms/select/SearchSelect';
import { TagSelect } from '../atoms/tag-select/TagSelect';
import { Button } from '../atoms/button/Button';
import { ZeroLightSettings, DEFAULT_ZEROLIGHT_SETTINGS } from '../tokens/settings';

export interface SaaSPocCardProps {
  settings?: ZeroLightSettings;
  onSuccess?: (payload: { workspaceName: string; region: string; permissions: string[] }) => void;
  className?: string;
}

const REGION_OPTIONS = [
  'North America (us-east-1)',
  'Europe (eu-central-1)',
  'Asia Pacific (ap-south-1)',
  'South East (ap-southeast-1)',
];

const PERMISSION_OPTIONS = [
  'View Invoices',
  'Manage Approvals',
  'Execute Settlement',
  'Administrator Access',
];

/**
 * ZeroLight SaaSPocCard Organism
 * Production-ready SaaS PoC template form assembled with FormField, Input, SearchSelect, and TagSelect.
 * Powered by pure React state (zero boilerplate).
 */
export const SaaSPocCard: React.FC<SaaSPocCardProps> = ({
  settings = DEFAULT_ZEROLIGHT_SETTINGS,
  onSuccess,
  className = '',
}) => {
  const [workspaceName, setWorkspaceName] = useState('Acme SaaS Core');
  const [region, setRegion] = useState('North America (us-east-1)');
  const [permissions, setPermissions] = useState<string[]>(['View Invoices', 'Manage Approvals']);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!workspaceName.trim()) {
      newErrors.workspaceName = 'Workspace name is required';
    }
    if (!region) {
      newErrors.region = 'Please select a deployment region';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
    onSuccess?.({ workspaceName, region, permissions });
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6 w-full ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Create New SaaS Workspace
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            ZeroLight-powered rapid PoC workflow
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800">
          PoC Live
        </span>
      </div>

      {/* Field 1: Workspace Name */}
      <FormField
        label="1. Workspace Name"
        badge="Single-line"
        error={errors.workspaceName}
      >
        <Input
          value={workspaceName}
          onChange={(val) => {
            setWorkspaceName(val);
            if (errors.workspaceName) setErrors((prev) => ({ ...prev, workspaceName: '' }));
          }}
          placeholder="Enter workspace name..."
          isError={!!errors.workspaceName}
          settings={settings}
        />
      </FormField>

      {/* Field 2: Cloud Deployment Region */}
      <FormField
        label="2. Cloud Deployment Region"
        badge="Fluid Popover"
        error={errors.region}
      >
        <SearchSelect
          options={REGION_OPTIONS}
          value={region}
          onChange={(val) => {
            setRegion(val);
            if (errors.region) setErrors((prev) => ({ ...prev, region: '' }));
          }}
          placeholder="Select cloud region..."
          isError={!!errors.region}
          settings={settings}
        />
      </FormField>

      {/* Field 3: Access Roles & Permissions */}
      <FormField
        label="3. Access Roles & Permissions"
        badge="Dynamic Corner Tags"
      >
        <TagSelect
          options={PERMISSION_OPTIONS}
          selected={permissions}
          onChange={setPermissions}
          placeholder="Assign access roles & permissions..."
          settings={settings}
        />
      </FormField>

      {/* Submit Action */}
      <Button
        type="submit"
        variant="primary"
        settings={settings}
        className="w-full mt-2"
      >
        {submitted ? '✓ Workspace Provisioned!' : 'Launch SaaS PoC Workspace'}
      </Button>

      {/* Live Form State Inspector */}
      {submitted && (
        <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-[11px] text-neutral-600 font-mono overflow-x-auto animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
            Submitted React State:
          </div>
          {JSON.stringify({ workspaceName, region, permissions }, null, 2)}
        </div>
      )}
    </form>
  );
};
