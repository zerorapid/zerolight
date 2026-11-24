# ZeroLight Master SaaS Constitution & Comprehensive Rulebook

> **The Sovereign B2B SaaS UI & Design Engine Standard.**  
> Crafted from first principles with TypeScript strict mode, reactive design tokens, and pure SVG telemetry.  
> This document is the single, non-negotiable authoritative source of truth for all human engineers, UI/UX designers, and autonomous AI agents building within ZeroLight.

---

## 📑 Table of Contents
1. [Executive Philosophy & The Morphic Engine](#1-executive-philosophy--the-morphic-engine)
2. [Spatial Hierarchy & The 3-Zone Law](#2-spatial-hierarchy--the-3-zone-law)
3. [Numbers, Currency & Typography Law](#3-numbers-currency--typography-law)
4. [Color, Polarity & Token Discipline](#4-color-polarity--token-discipline)
5. [The 6 Mandatory State Laws](#5-the-6-mandatory-state-laws)
6. [Data Tables, Grids & Workspaces](#6-data-tables-grids--workspaces)
7. [Pure SVG Telemetry & Geo-Dashboards](#7-pure-svg-telemetry--geo-dashboards)
8. [Modals vs. Drawers Decision Matrix](#8-modals-vs-drawers-decision-matrix)
9. [Forms, Inputs & Unsaved State Protection](#9-forms-inputs--unsaved-state-protection)
10. [Spacing Scale, Layout Shells & Metric Rhythm](#10-spacing-scale-layout-shells--metric-rhythm)
11. [Responsive Breakpoints (390px to 4K)](#11-responsive-breakpoints-390px-to-4k)
12. [Human Psychology & Classical UX Laws](#12-human-psychology--classical-ux-laws)
13. [Accessibility & Visual Ergonomics (WCAG 2.1 AA)](#13-accessibility--visual-ergonomics-wcag-21-aa)
14. [Enterprise Motion & Physics](#14-enterprise-motion--physics)
15. [Data Density Modes (Compact vs Comfortable vs Spacious)](#15-data-density-modes)
16. [Security, RBAC & Data Obfuscation](#16-security-rbac--data-obfuscation)
17. [Feedback & Toast Notification Hygiene](#17-feedback--toast-notification-hygiene)
18. [Power-User Keyboard Navigation](#18-power-user-keyboard-navigation)
19. [Anti-AI Slop Domain Copywriting Law](#19-anti-ai-slop-domain-copywriting-law)
20. [Automated CI & Registry Verification Checks](#20-automated-ci--registry-verification-checks)

---

## 1. Executive Philosophy & The Morphic Engine

### 1.1 Scalar Evolution (Stages I → V)
Instead of authoring dozens of disconnected, single-purpose components, every ZeroLight primitive must support scalar evolution via the `level` or `stage` prop:
- **Stage I · Raw (Atom):** Minimal raw data footprint (number + label). Mandatory for mobile viewports (390px), summary sidebars, and dense table cells.
- **Stage II · Labeled (Atom+):** Adds structured field labels, contextual category indicators, and metadata pills.
- **Stage III · Assisted (Molecule):** Adds inline filter chips, currency tags (`HYD · ₹`), and micro-actions.
- **Stage IV · Predictive (Molecule+):** Adds live suggestion dropdowns, auto-complete ranking, and keyboard cues (`↑ ↓ NAVIGATE · ENTER`).
- **Stage V · Omni-Bar / Capsule (Enterprise Organism):** Full conversational capsule with voice search, budget sliders, interactive telemetry, and submit triggers.

```tsx
// Example: Morphic StatCard Evolution
<StatCard level={1} label="Active Nodes" value="1,420" />
<StatCard level={2} label="Active Nodes" value="1,420" delta="+12.4%" sparklineData={[40, 55, 60, 78]} />
<StatCard level={3} label="Active Nodes" value="1,420" chart="area" timeframe="30d" onExport={handleExport} />
```

### 1.2 Component Fusions (Ben 10 Mutation)
Any two ZeroLight primitives can fuse together dynamically via polymorphic slots or the `ZeroMutate` primitive without layout breakages:
- `DataTable` ⨉ `WorldMap` = **GeoTelemetryTable** (hovering a table row zooms and highlights that region on the SVG map).
- `DetailDrawer` ⨉ `ApiKeyVault` = **EncryptedAuditDrawer** (slides open a drawer with AES key reveal and copy actions).
- `FilterBar` ⨉ `CommandPalette` = **OmniFilter** (converts standard dropdown filters into a keyboard-first spotlight palette).

### 1.3 Deterministic Gen-UI Rendering Runtime
AI models must **never output raw, hallucinated CSS** (e.g., `p-[13px]`, uncoordinated hex colors, or custom flex containers). Instead, the AI generates typed JSON schemas specifying:
```json
{
  "component": "StatCard",
  "level": 2,
  "fuseWith": "WorldMap",
  "tokens": { "polarity": "dark", "density": "comfortable" }
}
```
ZeroLight's engine renders the UI deterministically, guaranteeing 100% brand consistency, 1px hairline borders, and zero layout shift.

---

## 2. Spatial Hierarchy & The 3-Zone Law

* **Zone 1 (Header & KPIs - Top 20%):**
  - Contains page title, breadcrumb hierarchy, exactly **ONE** primary CTA, and a maximum of 4 `StatCard` KPI metrics.
* **Zone 2 (Unified Workspace - Middle 70%):**
  - Exactly **ONE** primary focal point (a Data Table, interactive Chart, Map, or Canvas). Never place two competing heavyweight widgets side-by-side on standard desktop views.
* **Zone 3 (Progressive Disclosure - Overlay):**
  - Secondary details, audit trails, and multi-field edit forms must never crowd the main view; they must open inside a `DetailDrawer` or `Modal`.
* **The Single Primary CTA Mandate:**
  - Exactly **ONE** `variant="primary"` button is permitted per visible screen header. All secondary actions must be `variant="outline"` or `variant="ghost"`.

---

## 3. Numbers, Currency & Typography Law

* **The `tabular-nums` Mandate:**
  - **Every** timestamp, currency value, metric KPI, percentage delta, and row count must have the CSS class `tabular-nums` with `font-sans` (never `font-mono`). Numbers must never shift or jitter during live data polling.
* **Plain English Labels (Zero Cryptic Abbreviations):**
  - Never truncate or vowel-strip labels (`Conf`, `Mgmt`, `Vio` are strictly banned). Always use full words (`Configuration`, `Management`, `Violet`). If space is tight, use wrapping pills or progressive disclosure.
* **The Truncation Safety Rule:**
  - Any element with `truncate` or `text-ellipsis` **must** provide a native `title="..."` attribute or hover `Tooltip` so users can inspect the complete string.
* **Dual Numbering System Support:**
  - Every financial component must seamlessly format both Western comma notation (`$1,000,000.00`) and Indian notation (`₹10,00,000.00` Lakhs/Crores) based on user locale.

---

## 4. Color, Polarity & Token Discipline

* **Zero Hardcoded Hex Colors:**
  - Hardcoding `#ffffff`, `#000000`, or raw Tailwind palette classes (`bg-blue-600`) inside components is strictly forbidden.
  - All surfaces must bind to `useZeroLight()` tokens (`universalFillColor`, `universalBorderColor`, `textIconColor`, `primaryButtonColor`, `hoverBackplateTint`, `borderWidth`).
* **1px Hairline Restraint (Anti-Slop):**
  - Surface separation is achieved via **1px hairline borders** and **subtle luminance stepping** (`#FFFFFF` on `#F8F9FA` in light mode, `#0E0E10` on `#09090B` in dark mode).
  - Multi-stop rainbow gradients, drop-shadow stacking, and glowing neon cards are strictly prohibited.
* **Optical Halation Defense:**
  - Pure `#000000` dark mode backgrounds and harsh `#000000` text on `#FFFFFF` are prohibited. Use softened zinc/charcoal (`#09090B` or `#0E0E10`) to eliminate eye-strain during extended enterprise usage.

---

## 5. The 6 Mandatory State Laws

Every asynchronous container and view must implement all 6 states without exception:
1. **Loading State:** Must use content-shaped `Skeleton` loaders matching the exact geometry of the incoming data (no generic spinners floating in blank containers).
2. **Empty State:** Must render an `EmptyState` component with an icon, a descriptive 1-line reason, and an actionable primary button (e.g., *"No API keys found — [Create First Key]"*).
3. **Error State:** Must render an `AlertBanner` with clear technical details and a 1-click **[Retry Operation]** button.
4. **Interactive States:** Explicit Hover, Focus-visible (keyboard rings), and Active states must be present on every clickable element.
5. **Mobile State (390px):** Must have **zero horizontal scroll**. Tables must automatically mutate into stacked cards or lock the primary identifier column.
6. **Network Degraded / Offline State:** When connectivity drops, display a persistent non-blocking top banner (*"Offline — Changes will sync when reconnected"*), disable write actions with tooltips, and serve cached reads.

---

## 6. Data Tables, Grids & Workspaces

* **Sticky Headers & Virtualization:**
  - Any table with more than 10 rows must feature a sticky header (`sticky top-0`).
  - Tables with >100 rows must implement server-side pagination or windowed virtualization. Never mount 1,000 DOM nodes at once.
* **Multi-Row Selection & Floating Batch Bar:**
  - Selecting rows must reveal a floating **Batch Action Bar** at the bottom viewport (e.g., *"4 items selected — [Export] [Archive] [Delete]"*).
* **Unified Filter Bar:**
  - Search, date pickers, and filter chips must be consolidated into a single unified `FilterBar` placed directly above the table.

---

## 7. Pure SVG Telemetry & Geo-Dashboards

* **Dual-Accent Visualization:**
  - Every chart (`AreaChart`, `WorldMap`, `GeoBreakdown`) must support both `chartPrimaryColor` and `chartSecondaryColor` bound to tokens.
* **Zero-API-Key Native Telemetry:**
  - Regional geo-dashboards must use compact interactive SVG `WorldMap` (using TopoJSON and D3 projections) with hover tooltips and choropleths. Third-party mapping SDKs requiring external API keys or heavy canvas runtimes are strictly banned.

---

## 8. Modals vs. Drawers Decision Matrix

| Surface | When to Use | Typical Content |
| :--- | :--- | :--- |
| **Modal (Centered Dialog)** | Destructive confirmations & micro-flows under 3 input fields | "Delete Cluster", "Rename Project", "Sign Out" |
| **DetailDrawer (Slide-Over)** | Deep record inspection, audit trails, and multi-field edit forms | User Profile, Transaction Log, Config Drawer |
| **Dedicated Page URL** | Multi-tab enterprise configuration with deep-linking requirements | `/settings/billing`, `/security/audit-logs` |

---

## 9. Forms, Inputs & Unsaved State Protection

* **Inline Micro-Validation:** Validation errors must appear directly beneath the specific offending input with red-tinted microcopy. Never use popup alert dialogs.
* **Forgiving Inputs (Postel’s Law):** Inputs must automatically strip spaces and dashes from phone numbers, credit cards, and GSTINs without triggering immediate angry validation errors.
* **Dirty Form Protection:** If a user attempts to close a drawer, modal, or navigate away with uncommitted edits, display a confirmation prompt: *"You have unsaved changes. Discard or keep editing?"*
* **Two-Step Verification for Destructive Actions:** Critical destructive actions (revoking production credentials, terminating clusters) must require typing the resource identifier to confirm (e.g., *"Type 'DELETE' to confirm"*).

---

## 10. Spacing Scale, Layout Shells & Metric Rhythm

* **Strict 4px/8px Grid Scale:**
  - `4px` (`gap-1` / `p-1`): Micro-spacing (badge dot offset, icon offset).
  - `8px` (`gap-2` / `p-2`): Button padding, input vertical padding.
  - `12px` (`gap-3` / `p-3`): Filter chip spacing, compact list item gaps.
  - `16px` (`gap-4` / `p-4`): Standard card internal padding (`StatCard` default).
  - `24px` (`gap-6` / `p-6`): Page margin gutters, dashboard widget separation.
  - `32px` (`gap-8` / `p-8`): Major section separation.
* **The Nested Padding Law:**
  $$\text{Container Padding (24px)} > \text{Card Padding (16px)} > \text{Element Gap (8px)}$$
* **Max-Width Cap:**
  - Reading surfaces, forms, and documentation must cap at `max-w-4xl` (`896px`) or `max-w-3xl` (`768px`) to prevent visual strain.

---

## 11. Responsive Breakpoints (390px to 4K)

* **Mobile (390px):**
  - Minimum touch target: **`44px x 44px`** for every button, icon, and link.
  - KPI grids collapse to single-column (`grid-cols-1`) or Level 1 compact atoms.
  - Zero horizontal viewport overflow.
* **Tablet (768px):**
  - KPI grids collapse to 2 columns (`grid-cols-2`).
  - Secondary table columns hide automatically (`hidden md:table-cell`).
* **Desktop (1024px – 1440px):**
  - Standard 4-column KPI grid (`grid-cols-4`).
  - Full data tables with sticky headers and batch action bars.
* **Ultra-Wide (1920px+):**
  - Lock content within a centered container or expand tables with diagnostic telemetry columns without inflating typography.

---

## 12. Human Psychology & Classical UX Laws

1. **Hick’s Law:** Max 7 options per dropdown. Collapse advanced settings behind an *"Advanced Configuration"* toggle with a live summary readout.
2. **Fitts’s Law:** Sticky bottom batch action bars; contextual row-level actions revealed on hover; minimum `36px` desktop / `44px` mobile click boundaries.
3. **Miller’s Law ($7 \pm 2$):** Max 4 KPI stat cards in a single row; chunk form inputs into 3–5 field logical cards.
4. **Jakob’s Law:** Standard conventions only (gear for settings, magnifying glass for search, standard top-left breadcrumbs).
5. **Von Restorff Effect:** In a neutral monochrome UI, only the single primary CTA carries the brand accent color.
6. **Doherty Threshold (<400ms):** Optimistic UI updates (<50ms) for toggles, archives, and renames; skeleton loaders appear within 100ms.
7. **Postel’s Law:** Forgiving inputs (auto-formatting; case-insensitive whitespace-tolerant search).
8. **Zeigarnik Effect:** Onboarding completion step pills (*"3 of 5 steps completed"*); draft state preservation when drawers close.
9. **Peak-End Rule:** Celebratory, reassuring confirmation animations on workflow completion; empathetic error recovery with 1-click retry.

---

## 13. Accessibility & Visual Ergonomics (WCAG 2.1 AA)

* **Dual-Signal Status Law:** Never use color alone to communicate status. Color must always be paired with an icon or text indicator:
  - Success: Green + `✓`
  - Warning: Amber + `⏱`
  - Error: Red + `⚠`
* **Screen Reader Polling:** Real-time polling values must use `aria-live="polite"` so screen readers announce changes without interrupting.
* **Focus Management:** Modals and Drawers must implement strict keyboard focus trapping (`focus-trap`). Pressing `Tab` must cycle only within the active modal until closed.

---

## 14. Enterprise Motion & Physics

* **No Bouncy Cartoon Animations:** Animations must feel snappy and industrial.
* **Duration & Easing Standards:**
  - Dropdowns & Tooltips: `100ms - 150ms` instant fade.
  - Drawers & Modals: `200ms - 250ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
* **Reduced Motion:** When `prefers-reduced-motion` is active, disable all transform animations and jump immediately to the end state.

---

## 15. Data Density Modes

Every `DataTable` and grid must support user-selectable density:
* **Compact Mode:** `32px` row height, `text-xs` (DevOps & financial operators).
* **Comfortable Mode (Default):** `44px` row height, `text-sm`.
* **Spacious Mode:** `56px` row height, `text-base` (Executive review).

---

## 16. Security, RBAC & Data Obfuscation

* **Anti-Frustration RBAC:** If a user lacks permission for an action, do **not** hide the button. Render it disabled with a lock icon and tooltip: *"Requires Admin permissions to execute."*
* **PII & Secret Obfuscation:** API keys and sensitive tokens must render masked (`sk_live_••••••••••••94f2`) with a 1-click Reveal eye icon and 1-click Copy button. Auto-mask again after 30 seconds.

---

## 17. Feedback & Toast Notification Hygiene

* Maximum of 3 toasts displayed concurrently in bottom-right corner.
* Success toasts auto-dismiss after **4 seconds**.
* Error toasts **never** auto-dismiss; they require explicit human dismissal or a 1-click retry action.

---

## 18. Power-User Keyboard Navigation

* Pressing `?` opens the global keyboard shortcut cheatsheet.
* Global shortcuts:
  - `Cmd+K` / `Ctrl+K`: Global spotlight search & command palette.
  - `Escape`: Closes active Modal, Drawer, or Dropdown.
  - `G` then `D`: Go to Dashboard.
  - `G` then `S`: Go to Settings.
  - `C`: Trigger primary creation workflow.
  - `J` / `K`: Navigate up/down table records.

---

## 19. Anti-AI Slop Domain Copywriting Law

* **Strictly Banned Generic Copy:**
  - ❌ *"Unlock actionable insights"*
  - ❌ *"Supercharge your team's workflow"*
  - ❌ *"Elevate your productivity to the next level"*
  - ❌ *"John Doe"* / *"Acme Corporation"* / *"foo@example.com"*
* **Required Technical & Operational Copy:**
  - ✅ *"US-East-1 Latency Spike: 240ms (+18%)"*
  - ✅ *"Stripe Webhook Delivery Failed: 429 Rate Limit Exceeded"*
  - ✅ *"Org: zerorapid-prod-ap-south-1"*
  - ✅ *"developer@zerolight.dev"*

---

## 20. Automated CI & Registry Verification Checks

Before any component, view, or template is merged into ZeroLight:
1. `npm run registry`: Component registry schema must be 100% in sync.
2. `npx tsc --noEmit`: Zero TypeScript compilation errors in strict mode.
3. `node tests/zerolight.test.mjs`: All unit, token, and contract tests must pass.
4. `npm run build`: Production Next.js build must compile with zero errors.
5. Bundle Check: Zero third-party canvas charting libraries, zero external mapping scripts.
