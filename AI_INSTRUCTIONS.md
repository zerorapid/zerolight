# ZeroLight • Standalone SaaS Design System Instructions

Use these instructions to guide any AI (Cursor, Claude, ChatGPT, GitHub Copilot, Antigravity) to build production-ready forms and SaaS PoC screens using the **ZeroLight** modular architecture.

---

## 🎯 System Prompt for any AI

```text
You are an expert React TypeScript engineer specializing in the ZeroLight SaaS Design System.
When building forms or PoC views, ALWAYS use the ZeroLight atomic primitives with simple React state (value & onChange).

Strict Rules:
1. Wrap forms inside: `bg-white rounded-[28px] border border-neutral-300 p-7 shadow-subtle space-y-6 w-full max-w-[440px] mx-auto`.
2. Wrap each input in `<FormField label="..." badge="...">` for standardized label hierarchy and error messaging.
3. Use simple React state (`const [val, setVal] = useState('')`).
4. All interactive elements must support tactile press deflection (`.tactile-press`) and spring popovers.
5. Import components from `@/components/zerolight`.
```

---

## 📦 Canonical Imports & Prop Contracts

All components export from `@/components/zerolight`:

```tsx
import {
  Input,         // or ZlInput, FluidStandardInput
  SearchSelect,  // or ZlSearchSelect, FluidSearchableSelect
  TagSelect,     // or ZlTagSelect, FluidMultiSelect
  Button,        // or ZlButton
  FormField,
  SaaSPocCard,
  DEFAULT_ZEROLIGHT_SETTINGS,
} from '@/components/zerolight';
```

---

### 1. FormField Molecule
Wraps inputs with consistent label, badge, helper text, and animated error states:

```tsx
<FormField label="Workspace Name" badge="Single-line" error={errors.workspaceName}>
  <Input
    value={workspaceName}
    onChange={setWorkspaceName}
    placeholder="e.g. Acme Core"
  />
</FormField>
```

---

### 2. Input Atom (`<Input />`)
Single-line kinetic input with tactile press, responsive clear `✕` button, and forwardRef:

```tsx
<Input
  value={email}
  onChange={setEmail}
  placeholder="name@company.com"
  clearable={true}
/>
```

---

### 3. SearchSelect Atom (`<SearchSelect />`)
Fluid popover dropdown with live search filter, kinetic sliding hover backplate, and animated SVG checkmark:

```tsx
<SearchSelect
  options={['North America (us-east-1)', 'Europe (eu-central-1)', 'Asia Pacific (ap-south-1)']}
  value={region}
  onChange={setRegion}
  placeholder="Select cloud region..."
/>
```

---

### 4. TagSelect Atom (`<TagSelect />`)
Dynamic multi-tag selection deck with kinetic inline chips, overflow counter badge (`+N more`), and custom animated SVG checkboxes:

```tsx
<TagSelect
  options={['View Invoices', 'Manage Approvals', 'Execute Settlement']}
  selected={permissions}
  onChange={setPermissions}
  placeholder="Assign permissions..."
/>
```

---

### 5. Kinetic Button Atom (`<Button />`)
Tactile action button with press deflection:

```tsx
<Button type="submit" variant="primary">
  Save & Continue
</Button>
```

---

## 🚀 Complete Copy-Paste SaaS PoC Template

```tsx
import React, { useState } from 'react';
import {
  FormField,
  Input,
  SearchSelect,
  TagSelect,
  Button,
} from '@/components/zerolight';

export const QuickSaaSPocForm: React.FC = () => {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('Pro Tier ($49/mo)');
  const [features, setFeatures] = useState<string[]>(['Audit Logs']);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6 w-full max-w-[440px] mx-auto"
    >
      <div className="border-b border-neutral-100 pb-3">
        <h2 className="text-base font-bold text-neutral-900 tracking-tight">
          Create SaaS Workspace
        </h2>
        <p className="text-xs text-neutral-500">
          ZeroLight-powered rapid PoC screen
        </p>
      </div>

      <FormField label="Workspace Name" badge="Required">
        <Input
          value={name}
          onChange={setName}
          placeholder="e.g. Acme Studios"
        />
      </FormField>

      <FormField label="Subscription Plan" badge="Fluid Popover">
        <SearchSelect
          options={['Starter ($19/mo)', 'Pro Tier ($49/mo)', 'Enterprise (Custom)']}
          value={plan}
          onChange={setPlan}
        />
      </FormField>

      <FormField label="Included Modules" badge="Dynamic Tags">
        <TagSelect
          options={['Audit Logs', 'Priority Support', 'Dedicated IP', 'Custom Webhooks']}
          selected={features}
          onChange={setFeatures}
        />
      </FormField>

      <Button type="submit" variant="primary">
        {submitted ? '✓ Workspace Ready!' : 'Launch Workspace'}
      </Button>
    </form>
  );
};
```
