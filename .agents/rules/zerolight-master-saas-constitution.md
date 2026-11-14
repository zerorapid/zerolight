# ZeroLight Master SaaS Constitution & Strict Design System Rulebook

> **The Sovereign B2B SaaS UI & Design Engine Standard.**  
> This document is the single, non-negotiable authoritative source of truth for all human engineers, UI/UX designers, and autonomous AI agents building within ZeroLight. Every rule herein is strictly enforced during code review and automated CI checks.

---

## 🏛️ Executive Philosophy & Core Architecture

### 1. The Morphic Engine (Evolve & Fuse)
* **Scalar Evolution (`level={1 | 2 | 3}`):**
  - **Level 1 (Atom):** Minimal raw data footprint (number + label). Mandatory for mobile (390px), summary sidebars, and dense table cells.
  - **Level 2 (Molecule):** Standard analytical footprint (number + label + sparkline + percentage delta). Default for standard desktop dashboard grids.
  - **Level 3 (Organism):** Full telemetry command footprint (number + interactive area chart + timeframe selector + drill-down drawer hook). Permitted only when that metric is the primary focal point of the viewport.
* **Component Fusion (Cross-Breeding Primitives):**
  - Any two primitives must cross-breed cleanly via polymorphic slots or `ZeroMutate` (e.g., `DataTable` + `WorldMap` = synchronized geo-analytics table; `DetailDrawer` + `ApiKeyVault` = encrypted audit drawer; `FilterBar` + `CommandPalette` = keyboard-driven spotlight filter).

### 2. Deterministic Gen-UI Rendering Runtime
* AI agents must **never generate raw, hallucinated HTML/CSS** (`p-[13px]`, custom hex codes, or arbitrary divs).
* AI agents must output **typed JSON schemas** referencing ZeroLight primitives, evolution levels, and token parameters. ZeroLight handles 100% of the visual styling deterministically.

### 3. Sovereign Craftsmanship (Anti-AI Slop)
* 100% token-driven, 1px hairline borders, subtle luminance stepping, tactile calm, and native support for both Western and Indian enterprise formats (GSTIN, UPI callbacks, Lakhs/Crores notation).

---

## 📐 Section 1: Spatial Hierarchy & Viewport Law

* **Rule 1.1: The 3-Zone Anti-Crowding Law**
  - **Zone 1 (Header & KPIs - Top 20%):** Compact title, breadcrumbs, single primary CTA, and a maximum of 4 `StatCard` metrics.
  - **Zone 2 (Unified Workspace - Middle 70%):** Exactly ONE primary focal point (a Data Table, Chart, Map, or Canvas). Placing two competing heavyweight widgets side-by-side on standard desktop views is strictly banned.
  - **Zone 3 (Progressive Disclosure - Overlay):** Fine details, audit logs, and complex forms must live inside a `DetailDrawer` or `Modal`.
* **Rule 1.2: The Single Primary CTA Mandate**
  - There can only be **ONE** `variant="primary"` button visible per screen header.
  - All secondary actions must use `variant="outline"` or `variant="ghost"`.

---

## 🔢 Section 2: Numbers, Currency & Typography Law

* **Rule 2.1: The `tabular-nums` Mandate**
  - **Every** timestamp, currency value, metric KPI, percentage delta, and row count must have the CSS class `tabular-nums` with `font-sans` (never `font-mono`). Numbers must never shift, jitter, or wrap during live data polling.
* **Rule 2.2: Plain English Labels Only (Zero Cryptic Abbreviations)**
  - Never truncate or vowel-strip labels (`Conf`, `Mgmt`, `Vio` are strictly banned). Always use full words (`Configuration`, `Management`, `Violet`). If space is constrained, use wrapping pills or progressive disclosure.
* **Rule 2.3: The Truncation Safety Rule**
  - Any element with `truncate` or `text-ellipsis` **must** provide a native `title="..."` attribute or hover `Tooltip` so users can always inspect the complete string.
* **Rule 2.4: Dual Numbering System Support**
  - Every financial component must seamlessly format both Western comma notation (`$1,000,000.00`) and Indian notation (`₹10,00,000.00` Lakhs/Crores) based on user locale.

---

## 🎨 Section 3: Color, Polarity & Token Discipline

* **Rule 3.1: Zero Hardcoded Hex Colors**
  - Hardcoding `#ffffff`, `#000000`, or raw Tailwind palette classes (`bg-blue-600`) inside components is strictly forbidden.
  - All surfaces must bind to `useZeroLight()` tokens (`universalFillColor`, `universalBorderColor`, `textIconColor`, `primaryButtonColor`, `hoverBackplateTint`, `borderWidth`).
* **Rule 3.2: 1px Hairline Restraint (Anti-Slop)**
  - Surface separation is achieved via **1px hairline borders** and **subtle luminance stepping** (`#FFFFFF` on `#F8F9FA` in light mode, `#0E0E10` on `#09090B` in dark mode).
  - Multi-stop rainbow gradients, drop-shadow stacking, and glowing neon cards are strictly prohibited.
* **Rule 3.3: Optical Halation Defense**
  - Pure `#000000` dark mode backgrounds and harsh `#000000` text on `#FFFFFF` are prohibited. Use softened zinc/charcoal (`#09090B` or `#0E0E10`) to eliminate eye-strain during extended enterprise usage.

---

## 🔄 Section 4: The 6 Mandatory State Laws

Every asynchronous container and view must implement all 6 states without exception:
1. **Loading State:** Must use content-shaped `Skeleton` loaders matching the exact geometry of the incoming data (no generic spinners floating in blank containers).
2. **Empty State:** Must render an `EmptyState` component with an icon, a descriptive 1-line reason, and an actionable primary button (e.g., *"No API keys found — [Create First Key]"*).
3. **Error State:** Must render an `AlertBanner` with clear technical details and a 1-click **[Retry Operation]** button.
4. **Interactive States:** Explicit Hover, Focus-visible (keyboard rings), and Active states must be present on every clickable element.
5. **Mobile State (390px):** Must have **zero horizontal scroll**. Tables must automatically mutate into stacked cards or lock the primary identifier column.
6. **Network Degraded / Offline State:** When connectivity drops, display a persistent non-blocking top banner (*"Offline — Changes will sync when reconnected"*), disable write actions with tooltips, and serve cached reads.

---

## 📊 Section 5: Data Tables & Workspaces

* **Rule 5.1: Sticky Headers & Virtualization**
  - Any table with more than 10 rows must feature a sticky header (`sticky top-0`).
  - Tables with >100 rows must implement server-side pagination or windowed virtualization. Never mount 1,000 DOM nodes at once.
* **Rule 5.2: Multi-Row Selection & Floating Batch Bar**
  - Selecting rows must reveal a floating **Batch Action Bar** at the bottom viewport (e.g., *"4 items selected — [Export] [Archive] [Delete]"*).
* **Rule 5.3: Unified Filter Bar**
  - Search, date pickers, and filter chips must be consolidated into a single unified `FilterBar` placed directly above the table.
* **Rule 5.4: User-Selectable Data Density**
  - Tables must support 3 density modes:
    - **Compact Mode:** `32px` row height, `text-xs` (DevOps & financial operators).
    - **Comfortable Mode (Default):** `44px` row height, `text-sm`.
    - **Spacious Mode:** `56px` row height, `text-base` (Executive review).

---

## 📈 Section 6: Data Visualization & Pure SVG Telemetry

* **Rule 6.1: Dual-Accent Visualization**
  - Every chart (`AreaChart`, `WorldMap`, `GeoBreakdown`) must support both `chartPrimaryColor` and `chartSecondaryColor` bound to tokens.
* **Rule 6.2: Zero-API-Key Native Telemetry**
  - Regional geo-dashboards must use compact interactive SVG `WorldMap` (using TopoJSON and D3 projections) with hover tooltips and choropleths. Third-party mapping SDKs requiring external API keys or heavy canvas runtimes are strictly banned.

---

## 🗂️ Section 7: Modals vs. Drawers Decision Matrix

* **Use a `Modal` (Centered Dialog) ONLY for:**
  - Destructive confirmations (e.g., *"Delete Database Cluster"*).
  - Fast, single-purpose flows under 3 input fields (e.g., *"Rename Workspace"*).
* **Use a `DetailDrawer` (Right Slide-Over) for:**
  - Inspecting item details, audit trails, and multi-field edit forms.  
  - *Reason:* Keeps background dashboard context visible while editing.
* **Use a Dedicated Page URL (`/settings/...`) for:**
  - Deep-linkable, multi-tab system configuration.

---

## 📝 Section 8: Forms, Inputs & Unsaved State Protection

* **Rule 8.1: Inline Micro-Validation**
  - Validation errors must appear directly beneath the specific offending input with red-tinted microcopy. Never use popup alert dialogs.
* **Rule 8.2: Forgiving Inputs (Postel’s Law)**
  - Inputs must automatically strip spaces and dashes from phone numbers, credit cards, and GSTINs without triggering immediate angry validation errors.
* **Rule 8.3: Dirty Form Protection**
  - If a user attempts to close a drawer, modal, or navigate away with uncommitted edits, display a confirmation prompt: *"You have unsaved changes. Discard or keep editing?"*
* **Rule 8.4: Two-Step Verification for Destructive Actions**
  - Critical destructive actions (revoking production credentials, terminating clusters) must require typing the resource identifier to confirm (e.g., *"Type 'DELETE' to confirm"*).

---

## 📏 Section 9: Spacing Scale & Layout Shells

* **The Strict 4px/8px Grid Scale:**
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

## 📱 Section 10: Responsive Viewports (390px to 4K)

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

## 🧠 Section 11: Human Psychology & Classical UX Laws

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

## ♿ Section 12: Accessibility & Visual Ergonomics (WCAG 2.1 AA)

* **Dual-Signal Status Law:** Never use color alone to communicate status. Color must always be paired with an icon or text indicator:
  - Success: Green + `✓`
  - Warning: Amber + `⏱`
  - Error: Red + `⚠`
* **Screen Reader Polling:** Real-time polling values must use `aria-live="polite"` so screen readers announce changes without interrupting.
* **Focus Management:** Modals and Drawers must implement strict keyboard focus trapping (`focus-trap`). Pressing `Tab` must cycle only within the active modal until closed.

---

## ⚡ Section 13: Enterprise Motion & Physics

* **No Bouncy Cartoon Animations:** Animations must feel snappy and industrial.
* **Duration & Easing Standards:**
  - Dropdowns & Tooltips: `100ms - 150ms` instant fade.
  - Drawers & Modals: `200ms - 250ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
* **Reduced Motion:** When `prefers-reduced-motion` is active, disable all transform animations and jump immediately to the end state.

---

## 🔒 Section 14: Security, RBAC & Data Obfuscation

* **Anti-Frustration RBAC:** If a user lacks permission for an action, do **not** hide the button. Render it disabled with a lock icon and tooltip: *"Requires Admin permissions to execute."*
* **PII & Secret Obfuscation:** API keys and sensitive tokens must render masked (`sk_live_••••••••••••94f2`) with a 1-click Reveal eye icon and 1-click Copy button. Auto-mask again after 30 seconds.

---

## 🔔 Section 15: Feedback & Toast Notification Hygiene

* **Toast Stacking & Dismissal:**
  - Maximum of 3 toasts displayed concurrently in bottom-right corner.
  - Success toasts auto-dismiss after **4 seconds**.
  - Error toasts **never** auto-dismiss; they require explicit human dismissal or a 1-click retry action.

---

## ⌨️ Section 16: Power-User Keyboard Architecture

* Pressing `?` opens the global keyboard shortcut cheatsheet.
* Global shortcuts:
  - `Cmd+K` / `Ctrl+K`: Global spotlight search & command palette.
  - `Escape`: Closes active Modal, Drawer, or Dropdown.
  - `G` then `D`: Go to Dashboard.
  - `G` then `S`: Go to Settings.
  - `C`: Trigger primary creation workflow.
  - `J` / `K`: Navigate up/down table records.

---

## 🚫 Section 17: Domain Copywriting Law (Anti-AI Slop)

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

## 🛠️ Section 18: Registry & Automated CI Verification

Before any component, view, or template is merged into ZeroLight:
1. `npm run registry`: Component registry schema must be 100% in sync.
2. `npx tsc --noEmit`: Zero TypeScript compilation errors in strict mode.
3. `node tests/zerolight.test.mjs`: All unit, token, and contract tests must pass.
4. `npm run build`: Production Next.js build must compile with zero errors.
5. Bundle Check: Zero third-party canvas charting libraries, zero external mapping scripts.
