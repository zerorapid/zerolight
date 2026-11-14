# ZeroLight ⚡

> **The Enterprise-Grade, Self-Evolving B2B SaaS UI & Design Engine.**  
> Crafted from first principles with TypeScript strict mode, reactive design tokens, and pure SVG telemetry. Zero third-party charting bloat, zero runtime baggage.

[![CI & Registry Integrity](https://github.com/zerorapid/zerolight/actions/workflows/ci.yml/badge.svg)](https://github.com/zerorapid/zerolight/actions/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/tests-163%20passed-10B981)](https://github.com/zerorapid/zerolight)
[![Primitives Count](https://img.shields.io/badge/primitives-115%20verified-3B82F6)](https://github.com/zerorapid/zerolight)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 💎 Why ZeroLight?

Most SaaS UI libraries force a painful trade-off: either install heavy, monolithic npm packages that break when your design drifts, or copy messy AI-generated code full of glowing gradients, dead buttons, and layout shifts.

**ZeroLight is different:**
- **Zero AI Footprints**: Handcrafted, restrained, and calm UI. Hairline 1px borders, crisp YIQ contrast, and strict `tabular-nums` alignment.
- **Copy-and-Own CLI (`npx zerolight`)**: Pull 115+ production primitives directly into any Next.js, Vite, or Remix project with recursive dependency resolution.
- **Self-Improving Learning Agent (`.agents/`)**: Drop a screenshot of Stripe, Linear, or Datadog; the system deconstructs spatial hierarchy, writes persistent rules, and refines primitives.
- **Telemetry & AI Training Feed**: Built-in telemetry engine (`/api/telemetry`) logs every generation brief, active token state, and human modification for fine-tuning your team's models.

---

## ⚡ Quick Start: Add Components to Any Project

You don't need to clone this entire repo to use ZeroLight. Use our standalone distribution CLI:

```bash
# 1. Initialize ZeroLight core (tokens, context, utils)
npx zerolight init

# 2. List all 115 available enterprise primitives
npx zerolight list

# 3. Add components directly into your codebase
npx zerolight add button stat-card data-table world-map organization-switcher api-key-vault
```

---

## 🎨 Interactive Visual Studio & Token Engine

ZeroLight ships with an interactive, draggable **Visual Studio Dock** on every page:

- **Theme Polarity**: Instant switching between `Light`, `Dark`, `Slate`, and `Contrast` with automatic surface luminance stepping.
- **Google Fonts Engine**: Dynamic on-demand Google Fonts injection (`Plus Jakarta Sans`, `Inter`, `Fraunces`, `Space Grotesk`, `DM Sans`, and curated SaaS pairings) with zero page reloads.
- **Spatial Geometry**: Real-time corner radius (`0px`, `8px`, `16px`, `24px`, `Pill`), height density (`36px` to `52px`), and border widths.
- **Motion Physics**: Restrained spring micro-interactions (`instant`, `snappy`, `damped`, `gentle`) with speed multipliers and live canvas simulation.
- **Bi-Directional RTL**: 1-click Arabic / Hebrew Right-to-Left layout mirroring.
- **Export Pipeline**: Copy clean CSS custom properties, Tailwind tokens, or JSON palettes in a single click.

---

## 🧱 The 115 Component Primitives Architecture

ZeroLight is organized into 5 strict atomic tiers:

```
src/components/zerolight/
├── atoms/          # 42 Pure Primitives (Button, Badge, Input, Switch, Slider, Kbd, Avatar...)
├── molecules/      # 43 Compound Blocks (WorldMap, OrgSwitcher, ApiKeyVault, AreaChart, Tabs...)
├── organisms/      # 15 Complex Systems (DataTable<T>, DetailDrawer, Modal, CommandPalette, AppShell...)
├── templates/      # 5 Reusable Blueprints (Dashboard, ConsoleTable, SettingsForm, ChatWorkspace...)
└── views/          # 7 Full Domain Pages (DevConsole, Billing, Donations, Finexy, Attendance...)
```

### High-Signal Highlights:
1. **`WorldMap` & `GeoBreakdown`**: Zero-API-key, SSR-safe equirectangular SVG choropleth maps with continent zoom presets, flow arcs, and country ranking telemetry.
2. **`DataTable<T>`**: High-density generic data table with inline spreadsheet cell editing, sorting, column visibility, and row selection.
3. **`OrganizationSwitcher`**: Enterprise multi-tenant workspace switcher with role tags and plan badges.
4. **`ApiKeyVault`**: Masked secret vaults with one-click copy feedback and permission scopes.
5. **Data Visualization Family**: Pure SVG area, bar, horizontal bar, donut, gauge, sparkline, and heatmap matrices with zero third-party charting libraries.

---

## 🛡️ Enterprise Security & Quality Assurance

- **163 Automated Invariant Tests**: Mathematically verifies contrast ratios, corner bounds, motion configs, and token propagation (`npm test`).
- **Playwright Chromium E2E Rig**: End-to-end testing across all 9 live routes, mobile viewports (`390x844`), and token persistence.
- **Production Headers**: Native clickjacking prevention (`X-Frame-Options: DENY`), MIME protection (`nosniff`), and strict referrer policies.
- **Automated CI Scanning**: GitHub Actions pipeline equipped with **TruffleHog OSS** for secret leak prevention and TypeScript strict checking.
- **Zod Schema Validation**: Client and server-side typed validation on all forms and `/api/telemetry` ingestion pipelines.

---

## 🏃 Running the Full Studio Locally

```bash
# 1. Clone the repository
git clone https://github.com/zerorapid/zerolight.git
cd zerolight

# 2. Install dependencies
npm install

# 3. Build and test
npm run registry
npm test
npm run build

# 4. Start production server
npm start
```

Visit:
- **`http://localhost:3000/`** — Visual Studio & Atomic Laboratory
- **`http://localhost:3000/docs/molecules`** — Molecules, World Maps & SaaS Controls
- **`http://localhost:3000/docs/organisms`** — Data Tables, Drawers & Shells
- **`http://localhost:3000/donations`** — Donations Enterprise Dashboard
- **`http://localhost:3000/docs/pages`** — Full SaaS Workspaces

---

## 📜 License

MIT License. Designed and engineered by the ZeroRapid team.
