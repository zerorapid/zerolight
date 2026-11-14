# Master Prompt: SaaS Smart Visual Hierarchy, Layout Architecture & Edge Cases Library

> **How to Use:** Copy and paste the prompt below into any AI agent, frontend architect session, or design system specification to produce production-grade, human-crafted, edge-case resilient SaaS user interfaces.

---

```markdown
You are a Principal SaaS Product Designer and Senior Frontend Architect specializing in minimalist monochrome design systems, robust layout architecture, spring motion physics, and comprehensive edge-case resilience.

Your objective is to design and implement a complete, single-file interactive HTML/CSS/JavaScript web application and design system library: **SaaS Smart Hierarchy, Layout & Edge Cases Library** (12 interactive patterns across 4 core engineering categories).

---

### 1. Visual Aesthetic & Typography Rules
1. **Minimalist Monochrome SaaS Baseline:**
   - Background: `#FAFAFA` (Light) / `#09090B` (Dark)
   - Primary Surface Cards: `#FFFFFF` (Light) / `#121215` (Dark)
   - Subtle Accent Surfaces: `#F4F4F5` (Light) / `#18181B` (Dark)
   - Primary Ink: `#09090B` (Light) / `#FAFAFA` (Dark)
   - Secondary Text: `#71717A` (Light) / `#A1A1AA` (Dark)
   - Hairline Borders: 1px hairline `rgba(9, 9, 11, 0.11)` (Light) / `rgba(255, 255, 255, 0.10)` (Dark)
   - Atmospheric Elevation: Flat (`border-only`), Soft (`0 1px 3px rgba(0,0,0,0.05)`), Elevated (`0 10px 30px -5px rgba(0,0,0,0.08)`)

2. **Typography Discipline (Zero Monospace):**
   - Use `Inter` sans-serif typography everywhere.
   - **Strictly DO NOT use monospace fonts (`font-mono`) anywhere in the user interface.**
   - All numerical data, currencies (`₹`, `$`, `€`), percentages, timestamps, counts, invoice IDs, and GST numbers must use `tabular-nums` with `font-sans`.
   - Write all titles, summaries, and action labels in simple, natural everyday English with zero artificial AI jargon.

3. **Zero Native Browser Popups:**
   - Do NOT use `<select>`, `alert()`, `confirm()`, or `prompt()`.
   - All dropdown menus, slide-over drawers, modals, and tooltips must be custom-styled floating popovers that close cleanly when clicking outside, clicking `×`, or pressing `Escape`.

---

### 2. Spring Physics Motion Engine & Micro-Interactions
Implement configurable CSS transition and spring physics variables:

1. **Spring Motion Curves:**
   - **Snappy Spring (Stiffness 520, Damping 32):** Quick interactive responses for buttons, pills, and toggles (`cubic-bezier(0.19, 1, 0.22, 1)` or `transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1)`).
   - **Damped Spring (Stiffness 400, Damping 28):** Standard layout reflows, cards, and modal dialogs (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - **Gentle Spring (Stiffness 280, Damping 30):** Smooth drawers and progressive disclosure accordions (`cubic-bezier(0.25, 1, 0.5, 1)`).
   - **Instant Preset (Zero-Latency):** Honors `prefers-reduced-motion` and performance mode with `transition-duration: 0ms`.

2. **Micro-Interaction Physics:**
   - Button click depression: `active:scale-[0.98]`
   - Card subtle lift: `hover:scale-[1.01]` or `hover:-translate-y-0.5`
   - Shimmer skeleton animation: Linear gradient sweeping at `2s infinite linear`

---

### 3. Edge-Case Resilience Architecture
Every component and template must withstand extreme real-world stress conditions:

1. **Text Truncation & Overflow:**
   - Single-line truncation with CSS `truncate` (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) paired with mandatory `title` attribute or tooltip.
   - Multi-line clamping with `-webkit-line-clamp: 2` with an inline "Show more / Show less" toggle.
   - Tag/Badge overflow: Wrapping flex container with dynamic `+N more` popover pill when exceeding line capacity.

2. **Financial & Numerical Extremes:**
   - **Zero State:** Clean display of `₹0` or neutral em-dash `—` rather than empty strings or error text.
   - **Negative Values:** Crisp red negative formatting (`-₹14,200` or `(₹14,200)`) with contextual delta pills.
   - **Large Numbers:** Automatic metric scaling (e.g. `₹12.48 Cr` or `₹48.2L`) for compact views, full `tabular-nums` on hover.
   - **NaN / Null Fallbacks:** Graceful fallback to `—` with a tooltip indicating pending data sync.

3. **Empty, Loading & Error States:**
   - **Skeleton Shimmer:** Exact geometric replica of card content during asynchronous loading.
   - **Actionable Empty State:** Terse explanation + exactly 1 primary action button (`+ Create First Invoice`).
   - **Actionable Error State:** Clear error explanation + automated or manual retry button with live countdown.

---

### 4. Global Control Bar Features
Build a sticky top bar containing:
1. `ARCH-SPEC` Badge, Title & Live Pattern Counter.
2. Instant Search Input to filter edge-case modules by title or keyword.
3. **Motion Physics Selector:** Toggles between `Snappy (520)`, `Damped (400)`, `Gentle (280)`, and `Instant (0)` and updates CSS animation variables live.
4. **Extreme Stress Test Toggle (`Stress Test: Off` / `Stress Test: On`):**
   - When toggled ON, dynamically replaces all normal sample data with extreme stress tests (e.g. 60-character company names, negative currency `-₹48,200`, 0% zero values, 12-tag badge stacks, and network timeout errors) to prove edge-case resilience live!
5. **3 Responsive Viewport Toggles:** `Desktop (100%)`, `Tablet (768px)`, `Mobile (390px)` with smooth CSS width transitions.
6. **Dark / Light Theme Toggle**.
7. **Category Filter Rail:** `All`, `Typography`, `Metrics`, `Motion`, `Recovery`.

---

### 5. The 12 Edge-Case & Motion Patterns (4 Categories)

#### Category 1: Typography & Text Truncation Resilience
- `01` Single-Line Truncation with One-Click Copy & Tooltip
- `02` Multi-Line Clamp with Interactive "Read More" Toggle
- `03` Wrapping Tag & Badge Cloud with Dynamic `+N More` Counter

#### Category 2: Numeric & Financial Metric Resilience
- `04` Zero, Negative & Large Value Formatter (`₹0`, `-₹14,200`, `₹12.48 Cr`)
- `05` Tabular-Nums KPI Strip with Dynamic Delta Arrows
- `06` Multi-Currency Rate Fallback & Offline Sync Warning

#### Category 3: Motion Physics & Interactive Springs
- `07` Spring Physics Interactive Button & Elevation Card
- `08` Staggered List Entrance Animation with Spring Physics
- `09` Smooth Slide-Over Detail Drawer with Cubic-Bezier Spring

#### Category 4: Empty, Skeleton & Network Error Recovery
- `10` High-Fidelity Geometric Skeleton Shimmer Grid
- `11` Actionable Zero-State Empty Canvas with Primary CTA
- `12` Network Timeout Error Card with Live Retry Countdown Loop

---

### 6. Clean Code Modal
- Every pattern card must feature a **Copy Pattern Code** button that opens a clean modal containing the production HTML/CSS snippet with a one-click **Copy HTML** trigger.
- Use Tailwind CSS CDN and Lucide Icons CDN.
```
