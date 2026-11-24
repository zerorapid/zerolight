# ZeroLight — Design System for SaaS

> **Live registry**: [`ui.zerorapid.in`](https://ui.zerorapid.in) · Built by [ZeroRapid](https://zerorapid.in)

A production-grade, token-driven React component library for B2B SaaS products. 107+ primitives across 6 tiers: Atoms → Molecules → Organisms → Templates → Views → Tools.

---

## Quick Install

### shadcn-compatible (recommended)

```bash
npx shadcn add https://ui.zerorapid.in/r/button.json
npx shadcn add https://ui.zerorapid.in/r/stat-card.json
npx shadcn add https://ui.zerorapid.in/r/data-table.json
```

### ZeroLight CLI

```bash
npx zerolight list
npx zerolight add button
npx zerolight add stat-card --shadcn
```

The CLI defaults to `https://ui.zerorapid.in/registry` with a GitHub raw fallback.

---

## What's Inside

| Tier | Count | Examples |
|---|---|---|
| **Atoms** | 43 | Button, Input, Badge, Switch, Checkbox, Avatar, Kbd, Spinner, Skeleton |
| **Molecules** | 46 | FormField, SearchBar, Dropdown, DatePicker, Tabs, AreaChart, Sparkline, DonutChart, WorldMap |
| **Organisms** | 19 | DataTable, CommandPalette, BillingPortal, TenantKit, TeamPermissions, BentoShowcase |
| **Templates** | 5 | DashboardTemplate, AnalyticsReportTemplate, ChatWorkspaceTemplate |
| **Views** | 8 | FinexyView (FinTech), BillingView, DonationsView, DevConsoleView, SchoolAttendanceView |
| **Tools** | 4 | ZeroFlash, ZeroAuditor, Atlas Map, Visual Studio Dock |

---

## Tools Hub (Public, Zero Login)

Access at [`ui.zerorapid.in`](https://ui.zerorapid.in) — no account required.

| Tool | Description |
|---|---|
| **ZeroFlash** | AI-powered component scaffolding from plain-English specs |
| **ZeroAuditor** | Design system audit: scan TSX files or any live website URL for token violations |
| **Atlas Map** | Interactive 6-tier component hierarchy navigator |
| **Visual Studio Dock** | Live runtime theme, typography, motion & density customizer |

> Admin panel (Settings & MCP) is PIN-protected. Contact `team@zerorapid.com` for access.

---

## Registry API

All endpoints include `Access-Control-Allow-Origin: *` CORS headers.

```
GET https://ui.zerorapid.in/registry/index.json        → full component index
GET https://ui.zerorapid.in/r/button.json              → shadcn-format payload
GET https://ui.zerorapid.in/api/audit-url              → website URL auditor
GET https://ui.zerorapid.in/sitemap.xml
GET https://ui.zerorapid.in/robots.txt
```

---

## Design Invariants

Three rules that **must never be broken**:

1. **Token Invariant** — Never hardcode hex colors (`#3B82F6`) or pixel radii. Always bind to `useZeroLight()` tokens.
2. **Motion Invariant** — All animations use `scaled.motionConfig.spring`. No uncoordinated CSS keyframes.
3. **Test Invariant** — Every change must pass 191/191 assertions:
   ```bash
   node tests/zerolight.test.mjs    # 191 / 191
   npx tsc --noEmit                 # 0 errors
   npm run build                    # 27 / 27 routes
   ```

---

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run registry   # rebuild public/registry/ (129 payloads)
npm run build      # production build
```

---

## Architecture

```
src/components/zerolight/
  atoms/          → 43 foundational primitives
  molecules/      → 46 composite controls & micro-charts
  organisms/      → 19 enterprise modules
  templates/      → 5 page skeletons
  views/          → 8 working SaaS pages
  tools/          → 4 public tools (ZeroFlash, ZeroAuditor, Atlas, Studio)
  gen-ui/         → Zod-validated generative UI renderer
  dashboard/      → Master coordinator shell
bin/
  cli.mjs         → npx zerolight CLI
  zerolight-mcp.mjs → AI agent MCP server (stdio JSON-RPC 2.0)
public/registry/  → 129 component JSON payloads
public/r/         → shadcn-format payloads
```

---

## MCP Server (AI Agents)

For Cursor, Windsurf, Claude Code, or any MCP-compatible agent:

```json
{
  "mcpServers": {
    "zerolight": {
      "command": "node",
      "args": ["bin/zerolight-mcp.mjs"]
    }
  }
}
```

Tools: `list_components`, `get_component`, `search_components`, `audit_component`

---

## Built by ZeroRapid

[ZeroRapid](https://zerorapid.in) is a product design and development agency specialising in B2B SaaS applications.

→ [Book a Craft Sprint](https://zerorapid.in) — ship your product's design system in 2 weeks.
