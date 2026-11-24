# Dashboard Shell Architecture Guide (AGENTS.md)

> This document guides any AI agent or developer modifying `src/components/zerolight/dashboard/dashboard-shell.tsx`.

---

## 1. File Responsibilities
`dashboard-shell.tsx` coordinates:
1. **Collapsible Sidebar**: Logo centroid, navigation items, and active kinetic morphing indicator.
2. **6 Atomic Tiers Submenu**: Foundations, Atoms, Molecules, Organisms, Templates, Pages.
3. **Workspace Control Strip**: Breadcrumb zone, "295 SaaS Pattern Variants Active" badge, and contextual horizontal tabs.
4. **Sub-View Router**: Renders the active library (`SaaSButtonLibrary`, `SaaSSelectionLibrary`, etc.) or destination application.

---

## 2. Test Invariants (DO NOT BREAK)
`tests/zerolight.test.mjs` directly tests for the presence of the following string tokens via `fs.readFileSync`:

| Required Token / Pattern | Tested Purpose |
|---|---|
| `DOCS_TIERS` | Array of 6 atomic tiers (`foundations`, `atoms`, `molecules`, `organisms`, `templates`, `pages`) |
| `activeTierData` | The currently selected tier data object |
| `sidebar-sub-pip` | Framer Motion `layoutId="sidebar-sub-pip"` active tier glider |
| `295 SaaS Pattern Variants Active` | Active variant synchronization badge |
| `<ZeroLightDocsPortal` | Documentation portal embedding |
| `<WorldAtlasMap` | Vector map studio embedding |
| `TOTAL COMPONENTS ADDED` & `TOTAL SAAS TEMPLATES` | Metrics in Overview tab |
| `docsSubView === "indicators"`, `dividers`, `tooltips`, `overlays`, `navigation`, `data`, `business`, `layouts`, `screens`, `edge-cases` | Routing conditions for all 15 pattern libraries |

---

## 3. Safe Refactoring Rule
When refactoring or breaking down `dashboard-shell.tsx` into smaller sub-components:
- Always ensure the required tokens above remain referenced or re-exported in `dashboard-shell.tsx`.
- Run `node tests/zerolight.test.mjs` to verify all 190 assertions remain 100% green.
