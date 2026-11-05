# ZeroLight • Fluid Input Atoms Studio

> A tactile, kinetic input component system & interactive studio engineered for modern React applications. Built with **React 18**, **TypeScript**, and **Tailwind CSS**.

---

## ⚡ Highlights

- 🔘 **Tactile Press Deflection**: Natural micro-compression on press (`active:scale-[0.985]`).
- 🌊 **Spring-Damped Menu Projections**: Apple-damped and elastic spring curve kinematics with waterfall stagger reveals.
- 🎚️ **Kinetic Sliding Hover Indicator**: Smoothly follows cursor focus across list items with zero latency.
- 📐 **Proportional Geometry**: Automatic inner radius, outer radius, and corner-tag calculations (`innerRadius = 0.65 * outerRadius`).
- 🏷️ **Dynamic Tag Deck**: Real-time corner-radius syncing, instant item dismissal, and overflow counting (`+N more`).
- 🎛️ **Live Visual Studio Dock**: 10 real-time controls for border color, fill, text, backplate tint, border scale, corner radius, density, font size, gap, and motion physics.
- 🤖 **AI-Ready Form Architecture**: Ships with `.cursorrules` and `AI_INSTRUCTIONS.md` for seamless generation by Claude, ChatGPT, Cursor, and Copilot.

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

Visit `http://localhost:5174/` and navigate to the **Design Asset** section to explore the interactive studio.

---

## 📦 Component Usage

### 1. Standard Input
```tsx
import { FluidStandardInput, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

<FluidStandardInput
  value={value}
  onChange={setValue}
  placeholder="Search invoice or reference..."
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

### 2. Searchable Select Popover
```tsx
import { FluidSearchableSelect, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

<FluidSearchableSelect
  options={['North America', 'Europe', 'Asia Pacific']}
  value={region}
  onChange={setRegion}
  placeholder="Select region..."
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

### 3. Multi-Select Tags
```tsx
import { FluidMultiSelect, DEFAULT_FLUID_SETTINGS } from '@/components/studio/FluidInputAtomsStudio';

<FluidMultiSelect
  options={['View Invoices', 'Manage Approvals', 'Execute Settlement']}
  selected={selectedPermissions}
  onChange={setSelectedPermissions}
  placeholder="Assign permissions..."
  settings={DEFAULT_FLUID_SETTINGS}
/>
```

---

## 🤖 Using ZeroLight with AI

See [`AI_INSTRUCTIONS.md`](./AI_INSTRUCTIONS.md) and [`.cursorrules`](./.cursorrules) to instruct any AI model to automatically build pixel-perfect forms using the ZeroLight design language.

---

## 📄 License

MIT © [ZeroRapid](https://github.com/zerorapid)
