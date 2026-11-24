---
trigger: always_on
description: Living rulebook of SaaS UI patterns learned from user references and visual critiques.
---

# Learned SaaS Design Rules (Auto-Updated by Design System Learner)

> This file is maintained by the `design-system-learner` agent. Each rule is derived from real SaaS references and user critiques to make ZeroLight screens consistently human-crafted.

---

### ZL-LEARN-001: Importance-First Control Hierarchy in Inspectors & Settings
- **Learned From**: Visual Studio 5-tab inspector review (2026-11-12)
- **Rule**: Always order controls by **frequency of change and visual impact** (Polarity/Brand before raw semantic hexes; Font Pairings & Typefaces before fine-grained tracking/line-height; Corner Radius & Density before Border Width & RTL). Group low-frequency tuning controls inside collapsed accordions with live summary readouts.
- **Anti-Pattern**: Dumping 8+ equal-weight sliders and color pickers flatly on initial render, or putting secondary toggles above primary choices.

### ZL-LEARN-002: Never Abbreviate Labels When Space Permits Clarity
- **Learned From**: Visual Studio Assets palette labels (`Emr` / `Vio` / `Amb` -> `Emerald` / `Violet` / `Amber`)
- **Rule**: Use full, plain-English labels (`Emerald`, `Violet`, `Sky`, `Amber`) with wrapping pill/grid layouts rather than cryptic 3-letter abbreviations. Human-crafted tools read effortlessly at a glance.
- **Anti-Pattern**: Truncated or vowel-stripped button labels (`Emr`, `Vio`, `Conf`, `Mgmt`) caused by forcing too many items into a rigid single row.

### ZL-LEARN-003: Dual-Accent Data Visualization & Elevation Tokens
- **Learned From**: SaaS analytics & Visual Studio token audit (2026-11-12)
- **Rule**: Every charting and geo-visualization primitive (`AreaChart`, `WorldMap`, `GeoBreakdown`) must support both `chartPrimaryColor` and `chartSecondaryColor`, and every surface card must honor `elevation` (`flat` | `soft` | `elevated`) with automatic atmospheric fallback when `borderWidth === 0`.

### ZL-LEARN-004: Zero-API-Key Native Geo Telemetry
- **Learned From**: SaaS regional analytics requirement (2026-11-12)
- **Rule**: Regional dashboards should pair a compact interactive SVG `WorldMap` (continent presets + zoom + choropleth + hover tooltip) alongside a ranked breakdown list (`ProgressBar` + `TrendDelta` + `tabular-nums`) inside `GeoBreakdown`, never heavy third-party map SDKs that require API keys or break SSR.

### ZL-LEARN-005: Tactile Calm Over Decorative Noise
- **Learned From**: Core ZeroLight handcrafted SaaS baseline
- **Rule**: Prefer 1px hairline borders, crisp YIQ-verified text contrast, `tabular-nums` alignment, and quiet neutral backgrounds (`#F8F9FA` / `#FFFFFF` or `#09090B` / `#0E0E10`) over multi-stop gradients, drop-shadow stacking, or decorative emojis.

### ZL-LEARN-006: Intentional Bleed Framing & Micro-Interaction Choreography (Stageshow Doctrine)
- **Learned From**: Benji Taylor's Stageshow Research (2026-11-25)
- **Rule**: Never shrink an entire desktop app window into a cramped 300px card (the "boxed screenshot" trap). Plan the crop before coding: let the window bleed off the bottom/right edges (`bleed="bottom"` or `"right"`), and use `ProductWindow` with authentic macOS traffic lights or browser chrome. In looping hero demos, every animation must have a cause (choreographed cursor arcs and presses), only the key story words must be real text (use `PlaceholderLines` for secondary context), and loops must reset cleanly without a visible seam or 4px snap.

### ZL-LEARN-007: SaaS Bento Grid Asymmetry
- **Learned From**: Linear & Stripe Bento grid standards via Stageshow
- **Rule**: In Bento grids, window chrome appears **exactly once** across the section. Only 1/3 to 1/2 of tiles show detailed UI; the remaining tiles must be an impactful high-contrast KPI stat (`StatCard`), an interactive tactile control (`Switch`), and a micro-diagram (`DonutChart` / `Sparkline`). No tile sits adjacent to another of the same kind.

