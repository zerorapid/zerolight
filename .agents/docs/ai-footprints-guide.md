# AI Footprints vs. Man-Made SaaS Craft — Field Guide

Why do users immediately spot an "AI-generated" SaaS screen even when the code compiles? Because LLMs default to **statistical averages** of marketing landing pages and generic templates rather than the quiet discipline of real product engineering.

Use this guide whenever auditing or generating ZeroLight screens.

---

## 1. Visual & Surface Footprints

| AI Footprint (Looks Synthetic) | Why It Happens | Man-Made SaaS Standard (ZeroLight Rule) |
| :--- | :--- | :--- |
| **Purple/cyan gradients & glowing cards** | Trained heavily on Dribbble/AI landing hero templates. | Solid, quiet surfaces (`#FFFFFF` on `#F8F9FA`, or `#0E0E10` on `#09090B`) with crisp 1px hairline borders. Accent color appears *only* on the single primary CTA and active chart/status indicators. |
| **Heavy drop shadows everywhere** | Overcompensates for weak surface hierarchy. | Use `elevation: "soft"` (`0 1px 2px rgba(0,0,0,0.02)`) + 1px border; reserve `elevated` for popovers, modals, and floating tooltips. |
| **Everything is a rounded `rounded-2xl` bento box** | Default LLM card wrapper for every section. | Mix hierarchy cleanly: full-bleed hairline dividers inside a unified workspace rather than nested card-inside-card-inside-card ("cardception"). |
| **5+ competing accent colors on one screen** | Random badge/icon tinting (`blue`, `purple`, `pink`, `orange`, `teal`). | Strict 1 brand accent + semantic status colors *only* when conveying real state (`emerald` = healthy, `amber` = warning, `rose` = error). |

---

## 2. Layout & Density Footprints

| AI Footprint | Man-Made SaaS Standard |
| :--- | :--- |
| **Uniform 3-column or 4-column symmetrical filler** | Real workflows are asymmetric: a focused primary table/canvas paired with progressive disclosure (`DetailDrawer`), not 6 equal boxes padded with filler text. |
| **Competing canvases** (Table + Chat + Audit Log + Chart all visible at once) | **3-Zone Hierarchy**: Top KPI strip (max 4 `StatCard`s) → 1 unified workspace → secondary detail in `DetailDrawer` on click. |
| **Cramped horizontal rows with clipped/truncated buttons** | Wrap gracefully or group low-frequency controls into a `StudioAccordion` / `DropdownMenu`. Never abbreviate labels like `Emr`/`Vio` just to force 5 columns. |
| **Missing mobile / overflow discipline** | Horizontal scroll inside tables only (`overflow-x-auto`), never page-level horizontal overflow at `390px`. |

---

## 3. Typography & Numeric Footprints

| AI Footprint | Man-Made SaaS Standard |
| :--- | :--- |
| **Jumping numbers on hover/live updates** | Every metric, currency, timestamp, percentage, and chart axis **must** use `tabular-nums` (`font-variant-numeric: tabular-nums`). |
| **Weak contrast between label, value, and metadata** | Clear typographic stepping: `11px–12px` muted uppercase/medium label → `20px–24px` semibold/bold `tabular-nums` value → `11px` muted delta. |
| **Every heading has an emoji (`🚀 Overview`, `✨ AI Insights`)** | Zero decorative emojis in SaaS headers, tabs, or nav rails. Use crisp `14px–16px` stroke icons (`lucide-react`) bound to `tokens.iconStrokeWidth`. |
| **Unprotected `truncate` without tooltip** | Every truncated table cell or title must include `title={text}` or `Tooltip`. |

---

## 4. Copywriting & Data Realism Footprints

| AI Footprint | Man-Made SaaS Standard |
| :--- | :--- |
| **Marketing hype inside a productivity app** (*"Supercharge your workflow", "Unlock actionable insights"*) | Terse, operational copy: *"Regional revenue by deployment zone"*, *"3 unverified absences flagged"*. |
| **Fake placeholder identities** (*"John Doe", "Acme Corp", "Lorem ipsum", "$12,345.67"*) | Realistic domain entities, plausible ratios, and consistent units (`$48.2K`, `+14.2%`, `us-east-1`). |
| **Verbose 2-sentence button labels & bloated descriptions** | Primary CTA: 2–3 words (`Submit Register`, `Export CSS`). Descriptions capped at `line-clamp-2`. |

---

## 5. Interaction & State Footprints

| AI Footprint | Man-Made SaaS Standard |
| :--- | :--- |
| **Happy-path-only screens** | Every data block ships with **Loading (`Skeleton`)**, **Empty (`EmptyState` + recovery CTA)**, **Error (`AlertBanner`)**, and **Selected/Hover** states. |
| **Dead buttons (`onClick={() => {}}`)** | Every interactive control either updates real state, opens a `DetailDrawer`/`Modal`, or triggers a clear toast feedback. |
| **Bouncy, floaty animations on utility controls** | Fast, purposeful physics (`snappy` / `damped`, `120ms–200ms`) with zero layout shift (`CLS = 0`). |
