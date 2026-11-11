# ZeroLight Design System — Enterprise Rules & Principles

> **Official Standard Operating Guidelines for Copywriting, Text Scaling, Layout Simplicity, and Anti-Crowded Dashboards.**

---

## 1. Copywriting, Word Limits & Text Overflow Laws

Every pixel of text in an enterprise SaaS application incurs cognitive load. ZeroLight enforces strict character, word, and line limits across all atomic and compound components.

### 1.1 Word & Character Limits Matrix

| Component Tier | Element | Max Words | Max Chars | Max Lines | Overflow Strategy | Rule & Guidance |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Atoms** | **Primary Button (CTA)** | 2–3 | 18–24 | 1 | `whitespace-nowrap` | Imperative verb first (*e.g., "Submit Register", "Create Cluster"*). Never full sentences. |
| **Atoms** | **Secondary / Ghost Button** | 1–2 | 14–18 | 1 | `whitespace-nowrap` | Concise action (*e.g., "Export", "Dismiss", "Cancel"*). |
| **Atoms** | **Badge & TagChip** | 1–2 | 12–16 | 1 | `truncate max-w-[120px]` | Single categorical label or state (*e.g., "Present", "API Gateway"*). |
| **Atoms** | **Input Placeholder** | 4–6 | 32–42 | 1 | `truncate` | Guidance query (*e.g., "Search by student name or roll #..."*). |
| **Molecules** | **StatCard Label** | 2–3 | 18–24 | 1 | `truncate uppercase` | High-level KPI title (*e.g., "Attendance Rate", "Present Today"*). |
| **Molecules** | **StatCard Value** | 1–2 | 8–12 | 1 | `tabular-nums font-bold` | Tabular numbers only (*e.g., "95.4%", "418 / 438"*). Prevents layout jitter. |
| **Molecules** | **StatCard Delta / Subtext**| 3–5 | 24–32 | 1 | `truncate text-neutral-500` | Contextual benchmark (*e.g., "vs district average (+1.2%)"*). |
| **Molecules** | **AlertBanner Title** | 6–10 | 50–65 | 1 (sm: 2) | Responsive wrap | Urgent actionable headline (*e.g., "3 Unverified Student Absences Flagged"*). |
| **Molecules** | **AlertBanner Description** | 16–22 | 110–140 | 2 | `line-clamp-2` | Max 2 lines. Explains exact cause and protocol. |
| **Molecules** | **EmptyState Title** | 4–6 | 28–40 | 1 | `truncate` | Clear zero-state declaration (*e.g., "No unexcused absences found"*). |
| **Molecules** | **EmptyState Description** | 14–20 | 90–130 | 2–3 | `max-w-md line-clamp-3` | Helpful recovery step without blaming the user. |
| **Organisms** | **Data Table Row Title** | 2–4 | 22–30 | 1 | `truncate max-w-[200px]` | Student/Host name + roll/IP. Must provide hover `title` preview. |
| **Organisms** | **Detail Drawer Header** | 3–5 | 24–36 | 1 | `truncate max-w-[280px]` | Entity name (*e.g., "Aria Montgomery (STU-1024)"*). |
| **Organisms** | **Modal Confirmation Title**| 3–5 | 24–36 | 1 | `truncate` | Destructive or sign-off action (*e.g., "Submit Daily Attendance"*). |
| **Organisms** | **Modal Description** | 18–26 | 120–160 | 3 | `line-clamp-3 text-neutral-600`| Exact consequence summary. |

---

### 1.2 Multi-Line Growth, Truncation & Responsive Laws

1. **The Single-Line Truncation Contract (`truncate`)**:
   - Used on all table cells, dropdown options, chips, breadcrumbs, and titles.
   - **Requirement**: Whenever `truncate` or `overflow-hidden text-ellipsis` is applied, the parent element **MUST** provide an HTML `title="..."` attribute or tooltip so users on all devices can inspect truncated copy without truncation loss.

2. **The 2-Line Clamping Contract (`line-clamp-2`)**:
   - Used for descriptions, alert callouts, and notes cards.
   - Text automatically stops at 2 lines with a trailing ellipsis (`...`), guaranteeing zero vertical height blowout across neighboring cards in grid layouts.

3. **Widow & Orphan Elimination**:
   - Never leave a single lonely word on the second line of a card heading or banner.
   - Apply `text-wrap: balance` to card titles and modal headings to maintain elegant typographic distribution.

4. **Zero Layout Shift (CLS = 0) on Numeric Updates**:
   - All statistics, time stamps, currency, percentages, and IDs **MUST** use `tabular-nums font-sans`.
   - Card heights must have defined min-heights (`min-h-[...]` or flex alignments) so text changing from 1 line to 2 lines does not produce jarring cumulative layout shifts.

5. **Responsive Typography Stepping**:
   - **Desktop ($\ge 1280\text{px}$)**: Heading `18px`, Base `14px`, Sublabel `12px`, Micro `10px`.
   - **Tablet ($768\text{px} - 1279\text{px}$)**: Heading `16px`, Base `13px`, Sublabel `11px`, Micro `10px`.
   - **Mobile ($< 768\text{px}$)**: Heading `15px`, Base `12px`, Sublabel `11px`, Micro `10px`. Truncate metadata columns first.

---

## 2. Dashboard Design Philosophy: The Anti-Crowding Law

> **"A dashboard is a decision cockpit, not a warehouse."**
> When a user requests a dashboard or UI screen, the AI assistant must design the **most simple, elegant, high-signal screen possible**. Crowded, cluttered, multi-tool Frankenstein screens are strictly forbidden.

### 2.1 The 3-Zone Visual Hierarchy

Every dashboard screen must adhere to this exact 3-zone structure:

```
┌────────────────────────────────────────────────────────────────────────┐
│  ZONE 1: HERO SESSION BAR & HIGH-SIGNAL METRICS                        │
│  - Branding + Session status indicator + Exactly 1 Primary Action CTA   │
│  - Exactly 3 to 4 StatCards (Attendance Rate, Present, Absent, Tardy)  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  ZONE 2: UNIFIED CONTROL & CORE WORKSPACE                              │
│  - 1 SegmentedControl (Grades) + 1 Select (Sections) + 1 SearchBar     │
│  - 1 Clean Roster / Fleet Table (No competing widgets side-by-side)    │
│  - Max 6 to 8 visible columns (Name, Grade, Time, Status, Guardian)    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  ZONE 3: PROGRESSIVE DISCLOSURE (ON DEMAND ONLY)                       │
│  - Secondary details NEVER clutter the main screen                     │
│  - DetailDrawer opens on row click (30-day history, notes, call parent)│
│  - ConfirmationModal opens on submission                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2.2 The Anti-Crowding Commandments

1. **Maximum 4 Metric Cards**:
   - Never display 6, 8, or 10 metric cards. Limit top telemetry to **3 or 4 high-signal indicators**.
   - If more metrics exist, group them in a drawer or tab—do not scatter them across the canvas.

2. **Exactly ONE Primary Action Button**:
   - Each viewport has **one single primary button** styled in the high-contrast brand color (e.g., `Submit Register` in `#510981`).
   - All auxiliary tools (*Export, Filter, Call Guardian*) **MUST** be styled as `variant="outline"` or `variant="ghost"`.

3. **Zero Competing Canvases**:
   - Never place a data table, an audit log, a live chat stream, and an analytics chart side-by-side on one screen.
   - Provide a clean, unified workspace where 100% of user attention is directed to the primary task.

4. **Progressive Disclosure via Slide-Over Drawers**:
   - Keep table columns tight ($\le 7$ columns).
   - If a student has parent contact history, medical notes, bus route information, and 30-day telemetry, **do not add 4 extra columns**. Put them in a slide-over `DetailDrawer` accessible with a single click.

5. **Generous White Space & Rhythms**:
   - Grid spacing: `gap-4` to `gap-6`.
   - Card padding: `p-5` to `p-6` (never cramped `p-2`).
   - Clean neutral canvas (`#F8F9FA` or `#FFFFFF`) with crisp 1px borders (`#D4D4D4` or tokens).

---

## 3. Checklist for Any AI Designing a Dashboard

Before rendering any new dashboard screen, verify:

- [ ] Is there **only 1 primary brand CTA** on the header?
- [ ] Are there **no more than 4 stat cards** at the top?
- [ ] Are all metric values formatted with **`tabular-nums`**?
- [ ] Are all titles and table cells protected with **`truncate` + `title`**?
- [ ] Are descriptions capped with **`line-clamp-2`**?
- [ ] Are secondary details tucked into a **`DetailDrawer`** rather than overcrowding the table?
- [ ] Is Cumulative Layout Shift (CLS) zero?
- [ ] Is the interface uncluttered, breathable, and calm?

---

## 4. Enterprise Data Visualization Laws

To guarantee rapid rendering, zero external charting bloat, and total design token reactivity, all telemetry and charting in ZeroLight follow these invariants:

### 4.1 The 8 Standard Chart Molecules
1. **`Sparkline`**: Ultra-compact inline trendline (`atoms`/`molecules`) embedded in `StatCard` or table cells.
2. **`AreaChart`**: Smooth cubic-bezier spline with vertical crosshair scrubbing, gradient fill, and floating backdrop-blur tooltips.
3. **`BarChart`**: Grouped and stacked columns with dynamic top cap corner radii matching `tokens.cornerRadius`.
4. **`HorizontalBarChart`**: Ranked progress bars with value formatting and rank numbers (`#1`, `#2`, ...).
5. **`DonutChart`**: Radial proportional distribution with central KPI readout and slice hover expansion.
6. **`GaugeChart`**: Semicircle radial dial with healthy/warning/critical status thresholds.
7. **`HeatmapMatrix`**: Multi-tier activity matrix for server load, commits, or weekly attendance.
8. **`FunnelChart`**: Stage-by-stage conversion drop-off funnel with inter-step retention percentages.

### 4.2 Data Visualization Guardrails
- **Zero Third-Party Chart Bloat**: 100% SVG + React + Framer Motion. Zero Chart.js, Recharts, or D3 bundle baggage.
- **Maximum Series Limit**: Never plot more than **3 concurrent series** on a single line/area chart.
- **Donut Slices Limit**: Max **5 slices** per donut chart; smaller fractions must be aggregated into an "Other" category.
- **Numeric Stability (CLS = 0)**: Every axis tick, tooltip value, and legend figure **MUST** use `tabular-nums font-mono` or `tabular-nums font-sans` so values never jitter during mouse scrubbing.
