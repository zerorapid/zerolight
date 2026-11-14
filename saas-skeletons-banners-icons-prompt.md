# Master Prompt: SaaS Skeleton Loaders, Advanced Banners, Typography Links & Lucide Icon Systems Library

> **How to Use:** Copy and paste the prompt below into any AI coding agent, frontend architect session, or design system specification to produce production-ready, zero-jargon, human-crafted SaaS skeleton states, system notice banners, typography link patterns, and mathematical Lucide icon systems.

---

```markdown
You are a Principal SaaS Product Designer and Senior Frontend Architect specializing in minimalist monochrome design systems, zero-layout-shift (CLS 0.00) shimmer loaders, high-visibility notice architecture, semantic typography link hierarchies, and mathematically disciplined SVG icon systems.

Your objective is to design and build a complete, single-file, interactive HTML, CSS, and JavaScript web application and production-grade component library: **SaaS Skeleton Loaders, Advanced Banners, Typography Links & Lucide Icon Systems Library** (18 interactive variants across 4 core engineering categories).

---

### 1. Visual Aesthetic & Typography Rules
1. **Minimalist Monochrome SaaS Baseline:**
   - Background: Clean `#FAFAFA` (Light) / `#09090B` (Dark).
   - Primary Surface Cards: `#FFFFFF` (Light) / `#121215` (Dark).
   - Subtle Accent Surfaces: `#F4F4F5` (Light) / `#18181B` (Dark).
   - Primary Ink: `#09090B` (Light) / `#FAFAFA` (Dark).
   - Secondary Text: `#71717A` (Light) / `#A1A1AA` (Dark).
   - Hairline Borders: 1px hairline `rgba(9, 9, 11, 0.12)` (Light) / `rgba(255, 255, 255, 0.10)` (Dark).
   - Atmospheric Elevation: Flat (`border-only`), Soft (`0 1px 3px rgba(0,0,0,0.04)`), Elevated (`0 10px 25px -5px rgba(0,0,0,0.08)`).

2. **Typography Discipline (Zero Monospace):**
   - Use `Inter` sans-serif typography everywhere.
   - **Strictly DO NOT use monospace fonts (`font-mono`) anywhere in the user interface.**
   - All pixel measurements (`14px`, `18px`, `24px`, `32px`), stroke widths (`1.25px`, `1.75px`, `2.25px`), timestamps, dates, counters, and metrics must use `tabular-nums` with `font-sans`.
   - Write all titles, descriptions, banner messages, and link labels in simple, natural everyday English with zero artificial AI marketing clichés.

3. **Zero Native Browser Popups & Selects:**
   - Do NOT use `<select>`, `alert()`, `confirm()`, or `prompt()`.
   - All interactive controls, code modals, dismiss transitions, and floating notifications must be custom-styled and close cleanly when clicking outside, clicking `×`, or pressing `Escape`.

---

### 2. Sticky Global Control Bar
Build a clean, sticky top header containing:
1. **Level Indicator & Live Variant Counter Badge:**
   - `SPEC-L1/L2` Badge, Title: **SaaS Skeleton Loaders, Advanced Banners, Typography Links & Lucide Icon Systems**, and a live badge showing the count of visible variants (`18 Active Variants`), updating dynamically on search and category filter.
2. **Instant Search Input:**
   - Real-time text search with clear (`×`) button to filter variants by title, description, or keyword.
3. **Live Shimmer Animation Toggle (`Shimmer: Playing` / `Shimmer: Paused`):**
   - Live button that toggles the CSS animation play state (`animation-play-state: running | paused`) across all skeleton loaders.
   - Allows designers, accessibility auditors, and QA engineers to inspect base geometric layout fidelity, padding, and contrast ratios without visual movement.
4. **Banner Reset Trigger (`Reset Banners`):**
   - Tracks dismissed notice banners with a dynamic counter (e.g. `2 Dismissed`) and restores all closed banners with a smooth fade-in entrance transition.
5. **3 Responsive Viewport Simulators:**
   - `Desktop (100%)`, `Tablet (768px)`, `Mobile (390px)` with smooth CSS frame width transitions and zero horizontal overflow (`390px` compliant).
6. **Dark / Light Theme Toggle:**
   - Crisp toggle switching between Light (`#FAFAFA`) and Dark Mode (`#09090B`) with instant token re-binding.
7. **Category Navigation Rail:**
   - `All (18)`
   - `Advanced Skeleton Loaders (Shimmer Effect) (5)`
   - `System Banners & Notice Bars (4)`
   - `Typography Links & Inline Action Styles (6)`
   - `Lucide Icon Scaling, Stroke Widths & Styles (3)`

---

### 3. Core Engineering & Interaction Specifications

#### Category 1: Advanced Skeleton Loaders (Shimmer Effect) — Cumulative Layout Shift: 0.00
Polished shimmer placeholders that prevent layout jitter while awaiting API responses.
- **Shimmer Physics:** Dual-pass linear gradient `linear-gradient(90deg, #F4F4F5 0%, #E4E4E7 50%, #F4F4F5 100%)` (Dark mode: `linear-gradient(90deg, #18181B 0%, #27272A 50%, #18181B 100%)`) with background size `200% 100%`, animating continuously at `1.8s infinite ease-in-out`.
- **Exact Shape Alignment:** Skeleton elements must mirror the exact dimensions, border radius, and padding of the finalized loaded components to guarantee **Cumulative Layout Shift (CLS) of 0.00**.

1. `01 KPI Metric Skeleton Card`
   - Mirrored card layout with subtle hairline border.
   - Header label skeleton (`w-24 h-3.5 rounded`), large metric number skeleton (`w-36 h-8 rounded-md`), and delta trend pill skeleton (`w-16 h-5 rounded-full`).
   - Includes toggle button to swap between loading skeleton and live populated metric (`$128,420.00 (+14.2%)`).

2. `02 Table Row Loading Skeletons`
   - Mirrored data table section featuring 3 consecutive loading rows.
   - Each row features: circular avatar skeleton (`w-8 h-8 rounded-full`), dual text lines (`w-32 h-3.5` and `w-44 h-3`), and right-aligned status badge pill skeleton (`w-20 h-6 rounded-full`).

3. `03 Avatar Profile Row Skeleton`
   - User profile header placeholder: Large circular avatar (`w-14 h-14 rounded-full`), primary user name line (`w-48 h-4 rounded`), secondary role/department line (`w-36 h-3 rounded`), and metadata badge skeleton (`w-24 h-3 rounded`).

4. `04 Dashboard Card Grid Skeletons`
   - Multi-column grid containing 2 mini-card placeholders.
   - Each card contains an icon box skeleton (`w-8 h-8 rounded-lg`), title skeleton (`w-24 h-3.5`), and progress/metric bar skeleton (`w-full h-2 rounded-full`).

5. `05 Article / Paragraph Skeleton`
   - Multi-line editorial text block featuring 4 staggered lines with natural proportional widths: `100%`, `92%`, `84%`, and `48%` with `12px` vertical breathing room.

---

#### Category 2: System Banners & Notice Bars — Dismissible & Action-Oriented
Persistent announcement bars, payment failure warnings, and cookie consent drawers.
- **Dismiss Interaction:** Non-destructive collapse animation (`max-height: 0; opacity: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; overflow: hidden`) with spring easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Tone & Severity:** Monochrome dark accents for general product news, soft red/rose tints for critical financial warnings, and warm amber for scheduled maintenance.

6. `06 Top Announcement Bar (Dark Accent)`
   - High-contrast solid dark container (`bg-zinc-950 text-white dark:bg-white dark:text-zinc-950`).
   - High-emphasis pill tag: `NEW` in white-on-black inverted styling.
   - Terse message: *"Multi-branch currency sync is now live for all Enterprise plans."*
   - Right-aligned interactive action link: *"Read Guide →"* with hover slide transition, plus clean dismiss `×` button.

7. `07 Payment Failure Warning Banner`
   - High-visibility destructive warning surface (`bg-red-50 text-red-900 border-red-200/80 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/60`).
   - Credit card alert icon with exclamation mark.
   - Bold title: *"Payment method expired"*.
   - Description: *"Please update your corporate card to prevent workspace interruption on Dec 1."*
   - Direct action CTA: Red solid button *"Update Card"* (`bg-red-600 hover:bg-red-700 text-white`), plus dismiss `×` button.

8. `08 Cookie Consent Banner / Drawer`
   - Polished bottom surface card with atmospheric elevation.
   - Heading: *"We value your privacy"*.
   - Terse explanation: *"We use cookies to analyze workspace usage and improve enterprise performance."*
   - Dual-action button group: Secondary outline button *"Decline"* and primary dark solid button *"Accept All"*.

9. `09 Scheduled Maintenance Notice Strip`
   - Soft amber warning container (`bg-amber-50 text-amber-900 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900/60`).
   - Inline wrench/tool icon.
   - Message: *"Scheduled server maintenance on Sunday 02:00 AM IST (Duration: 30m)."*
   - Right-aligned tabular pill: *"In 2 days"*, plus dismiss `×` button.

---

#### Category 3: Typography Links & Inline Action Styles — Semantic Affordance
Consistent text links with underline states, subtle muted tones, and external link indicators.
- **Accessibility & Focus:** All links must maintain minimum 4.5:1 text contrast and feature sharp keyboard focus rings (`focus:ring-2 focus:ring-zinc-950/20 focus:outline-none`).
- **Underline Discipline:** No browser-default rigid blue underlines. Use refined CSS `underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-950 dark:hover:decoration-white` with smooth transitions.

10. `10 Default Underline Link`
    - Primary text link: *"Review master compliance agreement →"*.
    - Refined underline with `underline-offset-4` and subtle 2px right arrow shift on hover (`group-hover:translate-x-1 transition-transform`).

11. `11 Subtle Muted Footer Link`
    - Quiet secondary link: *"Privacy & Data Security Policy"*.
    - Muted zinc tone (`text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors`) without underline until hovered.

12. `12 External Link with Arrow Icon`
    - Technical documentation link: *"Developer API Docs ↗"*.
    - Inline North-East external link icon (`w-3.5 h-3.5`) that shifts up and right by 1px on hover (`group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`).

13. `13 Breadcrumb Text Link`
    - Structured hierarchical breadcrumb: `Invoices / #INV-9042`.
    - Ancestor segment is interactive with subtle hover state; terminal segment is active ink with `tabular-nums`.

14. `14 Table Row Hover Action Link`
    - Enterprise entity row: *"Deccan Logistics Pvt Ltd"*.
    - Reveals contextual action link *"View Client →"* with smooth underline transition when hovering over the parent row.

15. `15 Disabled Link State`
    - Inactive link: *"Archived Tax Report (Unavailable)"*.
    - Muted disabled ink (`text-zinc-400 dark:text-zinc-600`), `cursor-not-allowed`, `pointer-events-none`, and explanatory tooltip hint on hover.

---

#### Category 4: Lucide Icon Scaling, Stroke Widths & Styles — Mathematical Discipline
Precise stroke-width system, sizing scale, and styling modes for Lucide icons.
- **Stroke-to-Size Mathematical Ratio:** Ensuring visual optical weight consistency across sizes so small icons remain legible and large display icons do not appear overly heavy.

16. `16 Stroke-Width System (1.25px - 2.25px)`
    - Comparative display of a single icon (e.g. `Shield` or `CheckCircle`) across 3 distinct optical stroke weights:
      - **1.25px Light:** Designed for large display headers (24px–32px) and airy minimal surfaces.
      - **1.75px Default:** The SaaS workhorse stroke for standard 16px–20px UI controls, inputs, and buttons.
      - **2.25px Bold:** Designed for dense 12px–14px micro-badges, selected states, and high-emphasis indicators.
    - Each weight displays its exact `stroke-width` value in `tabular-nums`.

17. `17 Icon Sizing Scale (14px → 32px)`
    - Comparative display of an enterprise icon (e.g. `Folder` or `Layers`) across the 4 foundational SaaS sizes:
      - **14px (Micro):** Paired with 11px/12px badges, tags, and inline breadcrumbs.
      - **18px (Compact / Default):** Standard size paired with 13px/14px body text, buttons, and inputs.
      - **24px (Medium):** Featured stat card headers, sidebar root icons, and modal titles.
      - **32px (Large / Display):** Empty state heroes, drag-and-drop file upload dropzones, and onboarding features.
    - Each size includes tabular pixel readout and recommended use-case label.

18. `18 Icon Styling Modes (Outline, Solid & Hybrid)`
    - Demonstrates 3 core icon rendering techniques in SaaS:
      - **Outline Mode:** Clean geometric stroke with `fill="none"` and `stroke="currentColor"`.
      - **Solid / Filled Mode:** High-impact glyph with `fill="currentColor"` for favorites, active bookmarks, and primary ratings.
      - **Badge Hybrid Mode:** Notification bell or message icon paired with an absolute-positioned live notification counter badge or status dot (`w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white`).

---

### 4. Copy-Paste Code Modal
Every variant card must include a `</> Code` button in its header:
- Clicking `</> Code` opens an elegant, custom-styled code modal displaying the clean, ready-to-use HTML/CSS snippet.
- Features an instant **"Copy Code"** button with dynamic feedback (`Copied!`) and checkmark icon.
- Closes via `×` button, clicking the backdrop, or pressing `Escape`.

---

### 5. Technical Deliverable Requirements
- Deliver as a single, fully-contained HTML file (`saas-skeletons-banners-icons-showcase.html`).
- Use Tailwind CSS CDN (`<script src="https://cdn.tailwindcss.com"></script>`) configured for custom font families and dark mode (`darkMode: 'class'`).
- Use Lucide Icons CDN (`<script src="https://unpkg.com/lucide@latest"></script>`) with `lucide.createIcons()` initialized after every DOM update.
- Ensure 100% clean JavaScript with zero console errors, zero external runtime dependencies, and immediate responsiveness on all viewports (`390px` to `1440px`).
```
