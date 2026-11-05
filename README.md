# ZeroLight • Standalone SaaS Design System

> A tactile, kinetic input component system & interactive studio engineered for modern React applications. Built with **React 18**, **TypeScript**, and **Tailwind CSS**. Designed to help both designers and developers rapidly build consistent SaaS Proof-of-Concept (PoC) products.

---

## ⚡ Highlights

- 🔘 **Tactile Press Deflection**: Natural micro-compression on press (`active:scale-[0.985]`).
- 🌊 **Spring-Damped Menu Projections**: Apple-damped and elastic spring curve kinematics with waterfall stagger reveals.
- 🎚️ **Kinetic Sliding Hover Indicator**: Smoothly follows cursor focus across list items with zero latency.
- 📐 **Proportional Geometry**: Automatic inner radius, outer radius, and corner-tag calculations (`innerRadius = 0.65 * outerRadius`).
- 🏷️ **Dynamic Tag Deck**: Real-time corner-radius syncing, instant item dismissal, and overflow counting (`+N more`).
- 🎛️ **Live Visual Studio Dock**: 10 real-time controls for border color, fill, text, backplate tint, border scale, corner radius, density, font size, gap, and motion physics.
- 🧩 **Modular Atomic Architecture**: Separated cleanly into `tokens/`, `atoms/`, `molecules/`, and `organisms/`.
- 🤖 **AI-Ready Form Architecture**: Ships with `.cursorrules` and `AI_INSTRUCTIONS.md` for seamless generation by Claude, ChatGPT, Cursor, and Copilot.

---

## 📦 Architecture & Directory Hierarchy

```text
src/components/zerolight/
├── tokens/
│   ├── settings.ts          # Studio token definitions & geometric math
│   ├── physics.ts           # Apple & elastic spring bezier curves
│   └── index.ts
├── atoms/
│   ├── input/               # Input.tsx (tactile press, clear action)
│   ├── select/              # SearchSelect.tsx (live filter popover, checkmark)
│   ├── tag-select/          # TagSelect.tsx (dynamic corner tags, overflow)
│   └── button/              # Button.tsx (tactile action button)
├── molecules/
│   ├── FormField.tsx        # Standardized label + badge + error wrapper
│   └── SlidingIndicator.tsx # GPU sliding backplate utility
├── organisms/
│   ├── VisualStudioDock.tsx # Studio calibration dock
│   └── SaaSPocCard.tsx      # Pre-assembled SaaS PoC form template
└── index.ts                 # Clean barrel export for the entire office
```

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/zerorapid/zerolight.git
cd zerolight

# 2. Install dependencies
npm install

# 3. Start the live studio
npm run dev
```

Visit `http://localhost:5174/#design-asset` to explore the interactive studio and live SaaS PoC form preview.

---

## 🛠️ ZeroLight CLI

Add components directly into any project:

```bash
# Initialize ZeroLight styles & folders in your project
npx zerolight init

# List available components & PoC blocks
npx zerolight list

# Add atomic components
npx zerolight add input
npx zerolight add select
npx zerolight add tag-select
npx zerolight add button
npx zerolight add form-field
npx zerolight add poc-card
```

---

## 💻 Component Usage (Simple React State)

```tsx
import React, { useState } from 'react';
import { FormField, Input, SearchSelect, TagSelect, Button } from '@/components/zerolight';

export const CreateWorkspaceForm: React.FC = () => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('North America (us-east-1)');
  const [roles, setRoles] = useState<string[]>(['Administrator']);

  return (
    <form className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6 max-w-[440px]">
      <FormField label="Workspace Name" badge="Required">
        <Input value={name} onChange={setName} placeholder="e.g. Acme Corp" />
      </FormField>

      <FormField label="Cloud Region" badge="Fluid Popover">
        <SearchSelect
          options={['North America (us-east-1)', 'Europe (eu-central-1)', 'Asia Pacific (ap-south-1)']}
          value={region}
          onChange={setRegion}
        />
      </FormField>

      <FormField label="Assigned Roles" badge="Dynamic Tags">
        <TagSelect
          options={['Administrator', 'Billing Manager', 'Read Only']}
          selected={roles}
          onChange={setRoles}
        />
      </FormField>

      <Button type="submit">Launch Workspace</Button>
    </form>
  );
};
```

---

## 📄 License

MIT © [ZeroRapid](https://github.com/zerorapid)
