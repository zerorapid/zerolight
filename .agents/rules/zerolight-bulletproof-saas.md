---
trigger: always_on
description: Bulletproof SaaS UI invariants and AI-footprint elimination rules for ZeroLight.
---

# ZeroLight Bulletproof SaaS Rules

Whenever building, editing, or reviewing UI screens or components in this workspace:

1. **Token-Driven Surfaces Only (`useZeroLight()`)**
   - Never hardcode hex colors, border radii, shadows, or font families in components or pages.
   - Bind to `tokens` (`universalFillColor`, `universalBorderColor`, `textIconColor`, `primaryButtonColor`, `hoverBackplateTint`, `borderWidth`) and `scaled` (`scaledCardRadius`, `scaledRadius`, `cardShadow`, `resolvedFontFamily`, `resolvedHeadingFontFamily`, `motionConfig`).
   - Use `tabular-nums` with `font-sans` (never `font-mono`) for KPIs, currency, timestamps, counts, and chart axes.

2. **Handcrafted ("Man-Made") Hierarchy — Zero AI Footprints**
   - **No decorative clutter**: Never add gratuitous gradients, glowing neon shadows, rainbow badges, or decorative emojis in headings/nav items.
   - **One Primary CTA per viewport**: Only one `variant="primary"` button per screen header/zone; secondary actions use `outline` or `ghost`.
   - **Quiet Surfaces, Sharp Contrast**: Rely on 1px hairline borders, subtle luminance stepping (`#FFFFFF` on `#F8F9FA` or `#0E0E10` on `#09090B`), and generous breathing room (`p-5`/`p-6`, `gap-4`/`gap-6`).
   - **Real Domain Copy**: Never use cliché AI SaaS copy ("Unlock actionable insights", "Supercharge your workflow", "John Doe", "Acme Corp"). Use specific, terse, operational domain nouns and imperative verbs.

3. **3-Zone Anti-Crowding Layout**
   - Zone 1: Compact header + 1 primary CTA + max 4 KPI `StatCard`s.
   - Zone 2: Unified filter bar + 1 primary workspace (table, chart, map, or form) — never 3+ competing widgets side-by-side.
   - Zone 3: Secondary details live inside `DetailDrawer` or `Modal` via progressive disclosure.

4. **Always Complete Every Interactive State**
   - Every view and async container must handle **Loading (`Skeleton`)**, **Empty (`EmptyState`)**, **Error (`AlertBanner` + retry)**, **Hover/Focus**, and **Mobile (`390px` zero horizontal overflow)**.
   - Every `truncate` element must expose a `title` attribute or tooltip.

5. **Registry & Test Discipline**
   - After modifying or adding any component under `src/components/zerolight/`, run `npm run registry`, `npx tsc --noEmit`, `node tests/zerolight.test.mjs`, and `npm run build`.
