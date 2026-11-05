# AquaFlow Enterprise UI — 7 Non-Negotiable Architectural Rules

These rules govern all UI code, components, and layouts in AquaFlow Enterprise:

### 1. The Bulletproof CSS Law (No Fragile Arbitrary Classes)
- Never write complex, unescaped arbitrary Tailwind syntax like `bg-[linear-gradient(110deg,#...)]` that Tailwind's JIT compiler silently drops at compile time.
- All primary actions must use guaranteed, bulletproof obsidian black (`bg-[#0B0F19] text-white hover:bg-[#1E293B]`) with crisp white typography.
- Never allow a button to render with a drop-shadow but missing background.

### 2. The Zero-Cache Law
- Strictly zero `localStorage`, `sessionStorage`, `document.cookie`, `caches`, or service workers.
- All state lifecycles are purely in-memory reactive React state.

### 3. The Design System Fidelity Law (Translate, Never Clone)
- When building features from reference specs, **never** literally copy outdated legacy layouts (e.g. raw HTML `<select>`, colored left borders, blocky progress bars).
- Always translate data into our established design tokens:
  - Metric KPIs: Use `MetricCard` with top-right icons, embedded vector sparklines, and delta pills.
  - Form & Filter Controls: Use our custom pill `SearchableSelect`, `Input`, and `CapsuleSegment`.
  - Data Visualizations: Use our refined vector graphs, `RadialProgressCard` gauges, and dual-axis telemetry charts.

### 4. The Micro-Motion Physics Law (Tactile, Never Gimmicky)
- Strictly zero `animate-spin` or rotating icon gimmicks on hover, click, or active states.
- Micro-interactions must feel tactile and Apple-grade:
  - Buttons: `active:scale-[0.98] transition-all duration-150 ease-out`.
  - Inputs: `focus:shadow-[0_0_0_3px_rgba(11,15,25,0.08)] focus:border-[#0B0F19] transition-all duration-200`.
  - Tabs: Fluid spring layout sliding using Framer Motion `layoutId`.
  - Cards: Micro hover lift (`hover:-translate-y-0.5 hover:shadow-floating`).

### 5. The Strict 42px & Non-Wrapping Law
- All standard inputs, dropdowns, popovers, and segmented controls must maintain `h-[42px]` with pill geometry.
- Table headers, pond names, and category chips must enforce `whitespace-nowrap` to prevent awkward mid-word hyphenation breaks.

### 6. The Fluid Typescale Law (Sidebar Dynamic Adaptation)
- Content layouts and typography must gracefully scale as the sidebar expands (+202px) or collapses (-202px).
- Column widths in matrix tables must use explicit min-widths and flex priorities so primary columns are never crushed.

### 7. The Crisp Light Mode & Contrast Anchor Law
- Strictly no dark mode on the canvas or cards: `#FFFFFF` cards on `#F4F5F8` background.
- Ground primary focal points in solid obsidian black (`#0B0F19`) and subtle jewel accents (Ocean `#0284C7`, Emerald `#10B981`, Amber `#F59E0B`, Crimson `#EF4444`, Indigo `#6366F1`).
