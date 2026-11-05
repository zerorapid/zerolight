# ZeroLight • AI Form Builder System Instructions

Use these instructions to guide any AI (Cursor, Claude, ChatGPT, GitHub Copilot, Antigravity) to build production-ready forms using the **ZeroLight Fluid Input Atoms** design system.

---

## 🎯 System Prompt to give to any AI

```text
You are an expert React UI engineer specializing in the ZeroLight Component System.
When designing or generating forms, ALWAYS use the ZeroLight atomic primitives instead of raw HTML <input>, <select>, or browser checkboxes.

Follow these strict design rules:
1. Wrap forms inside a card container with: `bg-white rounded-[28px] border border-neutral-300 p-6 md:p-8 shadow-subtle space-y-6 max-w-lg mx-auto`.
2. All input triggers must include tactile press deflection (`.tactile-press` with `active:scale-[0.985]`).
3. All popover menus must use the spring-damped projection (`.menu-transition`, `.menu-visible`, `.menu-hidden`) with a sliding hover backplate indicator.
4. Dropdown options must include staggered entrance animations and animated SVG checkmark draws.
5. All controls must accept and respect the `FluidStudioSettings` token object (or default to `DEFAULT_FLUID_SETTINGS`).
```

---

## 📦 Component Imports & Prop Contracts

All components are exported from `src/components/studio/FluidInputAtomsStudio.tsx`.

### 1. Default Settings Token
```tsx
import { DEFAULT_FLUID_SETTINGS, FluidStudioSettings } from '@/components/studio/FluidInputAtomsStudio';

// Default values:
// borderColor: '#d4d4d4'
// fillColor: '#ffffff'
// textColor: '#111111'
// backplateColor: '#f0f0f0'
// borderWidth: 1
// radius: 16 (Pill geometry adapts at >= 20px)
// height: 48 (Density range: 40px to 52px)
// fontSize: 14 (Range: 13px to 16px)
// gap: 8 (Menu offset gap: 4px to 14px)
// spring: '2' ('1' = Subtle Linear, '2' = Apple Damped, '3' = Elastic Spring)
```

---

### 2. Standard Input (`<FluidStandardInput />`)
Single-line text input with responsive clear button (`✕`) and tactile press.

```tsx
import { FluidStandardInput, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

<FluidStandardInput
  value={formData.fullName}
  onChange={(val) => setFormData({ ...formData, fullName: val })}
  placeholder="e.g. John Miller"
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

---

### 3. Searchable Select Popover (`<FluidSearchableSelect />`)
Fluid dropdown with internal live filter search, spring projection, kinetic sliding hover backplate, and animated SVG checkmark draw.

```tsx
import { FluidSearchableSelect, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

const REGIONS = [
  'North America (us-east-1)',
  'Europe (eu-central-1)',
  'Asia Pacific (ap-south-1)',
  'South East (ap-southeast-1)',
];

<FluidSearchableSelect
  options={REGIONS}
  value={formData.region}
  onChange={(val) => setFormData({ ...formData, region: val })}
  placeholder="Select region..."
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

---

### 4. Dynamic Multi-Select Tags (`<FluidMultiSelect />`)
Dynamic corner-tag deck with inline chip removal (`×`), overflow badge (`+N more`), and custom animated SVG checkboxes.

```tsx
import { FluidMultiSelect, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

const PERMISSIONS = [
  'View Invoices',
  'Manage Approvals',
  'Execute Settlement',
  'Administrator Access',
];

<FluidMultiSelect
  options={PERMISSIONS}
  selected={formData.permissions}
  onChange={(tags) => setFormData({ ...formData, permissions: tags })}
  placeholder="Assign permissions..."
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

---

## 🚀 Complete Example Form Template for AI Generation

Here is a ready-to-use template that any AI can generate when building a form:

```tsx
import React, { useState } from 'react';
import {
  FluidStandardInput,
  FluidSearchableSelect,
  FluidMultiSelect,
  DEFAULT_FLUID_SETTINGS,
} from '@/components/studio/FluidInputAtomsStudio';

export const CustomerOnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    services: ['Cloud Storage'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted payload:', formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[440px] mx-auto p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Customer Onboarding
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          ZeroLight-powered fluid input workflow.
        </p>
      </div>

      <FluidStandardInput
        value={formData.companyName}
        onChange={(val) => setFormData({ ...formData, companyName: val })}
        placeholder="e.g. Acme Corporation"
        settings={DEFAULT_FLUID_SETTINGS}
      />

      <FluidSearchableSelect
        options={['United States', 'Germany', 'Japan', 'India', 'Singapore']}
        value={formData.country}
        onChange={(val) => setFormData({ ...formData, country: val })}
        placeholder="Select country..."
        settings={DEFAULT_FLUID_SETTINGS}
      />

      <FluidMultiSelect
        options={['Cloud Storage', 'Dedicated IP', 'Audit Logging', 'Priority SLA']}
        selected={formData.services}
        onChange={(tags) => setFormData({ ...formData, services: tags })}
        placeholder="Select services..."
        settings={DEFAULT_FLUID_SETTINGS}
      />

      <button
        type="submit"
        className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-full tactile-press transition-all shadow-sm cursor-pointer"
      >
        Submit Registration
      </button>
    </form>
  );
};
```
