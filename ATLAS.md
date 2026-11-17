# ZeroLight — Architectural Atlas (Mental Landmark Map)

> **Purpose**: This file is the single source of truth for any AI agent or human developer navigating ZeroLight. Read this to orient your mental model in 1 second, even after a 6-month gap.

---

## 🏛️ The 6-Tier Spatial Memory Palace

```
District 0: FOUNDATIONS (Root Tokens & Math Physics)
  └── src/components/zerolight/types.ts & context.tsx
      • YIQ Contrast Formula: (r*299 + g*587 + b*114) / 1000
      • Spring Motion: Damped (400/28), Snappy (520/32), Elastic (460/20), Gentle (280/30), Instant
      • Dynamic Google Fonts: Runtime link injection with zero page reload

District 1: ATOMS (43 Foundational Primitives — Zero Domain Logic)
  └── src/components/zerolight/atoms/
      • Buttons, Inputs, Switches, Checkboxes, Badges, Skeletons, Spinners, Kbd, Avatars

District 2: MOLECULES (45 Composite Controls & Micro-Charts)
  └── src/components/zerolight/molecules/
      • FormFields, SearchBars, Dropdowns, DatePickers, Breadcrumbs, Tabs
      • D3 AreaChart, Sparkline, BarChart, DonutChart, WorldMap (Zero-API TopoJSON map)

District 3: ORGANISMS (18 Enterprise Modules)
  └── src/components/zerolight/organisms/
      • BillingPortal (Stripe tiers & cards), TenantKit (Multi-tenant switcher), TeamPermissions (RBAC)
      • DataTable (Virtual grid + TSV export), CommandPalette (⌘K), GeoBreakdown, AuditLog

District 4: TEMPLATES (6 Page Skeletons)
  └── src/components/zerolight/templates/
      • DashboardTemplate, AnalyticsReportTemplate, ConsoleTableTemplate, ChatWorkspaceTemplate

District 5: DESTINATION APPLICATIONS (8 Working SaaS Pages)
  └── src/components/zerolight/views/
      • FinexyView (FinTech), BillingView, DonationsView, DevConsoleView, SchoolAttendanceView
```

---

## 🛠️ Showcase, Tooling & Distribution Map

| Path | Purpose | What It Contains |
|---|---|---|
| `src/components/zerolight/libraries/` | 15 Showcase Libraries | All 295 pattern variants (Buttons, Inputs, Overlays, Data, Layouts) |
| `src/components/zerolight/libraries/common/` | Shared Library Primitives | `LibraryHeader` (Search + Badges), `CodeModal` (TSX Viewer), `VariantCard` |
| `src/components/zerolight/dashboard/` | Dashboard Shell | Master coordinator shell hosting sidebar, top-nav, and 6-tier routing |
| `src/components/zerolight/docs-studio.tsx` | Visual Studio Dock | 5-tab IDE for runtime theme, typography, motion & token customization |
| `bin/cli.mjs` | The `zerolight` CLI | Commands: `npx zerolight init`, `list`, `add <component>` |
| `bin/zerolight-mcp.mjs` | AI Agent MCP Server | Stdio JSON-RPC 2.0 server with 4 tools for Cursor, Windsurf, Claude Code |
| `scripts/build-registry.mjs` | Registry Compiler | Scans 120 primitives and builds `public/registry/*.json` |
| `public/registry/` | Component Payloads | 120 standalone JSON component payloads + `index.json` |

---

## 🛡️ The 3 Non-Negotiable Invariants

1. **Token Invariant**: Never hardcode raw hex colors (`#3B82F6`) or arbitrary pixel radii. Always bind to `useZeroLight()` tokens (`universalFillColor`, `universalBorderColor`, `textIconColor`, `scaledRadius`).
2. **Motion Invariant**: All animations must bind to `useZeroLight().scaled.motionConfig.spring` or `motionConfig.transition`. No uncoordinated CSS keyframes.
3. **Test Invariant**: Every change must pass 100% of automated tests:
   ```bash
   node tests/zerolight.test.mjs    # Must pass 188 / 188 assertions
   npx tsc --noEmit                 # Must pass with 0 errors
   ```
