# ZeroLight Design System — AI Coding Agent Architecture Guide (AGENTS.md)

> This file is the primary context map for AI coding agents (Antigravity, Cursor, Claude Code, Copilot) working in `src/components/zerolight/`. Read this before modifying any component.

---

## 1. Quick Directory Map

| Path | Responsibility | Line Budget |
|---|---|---|
| `types.ts` | Master TypeScript interfaces (`ZeroLightTokens`, `MotionConfig`, `ScaledTokens`) | Do not duplicate types elsewhere |
| `context.tsx` | `ZeroLightProvider` & `useZeroLight()` hook, runtime CSS vars & Google Fonts injector | Single source of token truth |
| `atoms/` (43 files) | Pure foundational primitives (Buttons, Inputs, Badges, Toggles). Zero domain logic. | ≤ 150 lines per file |
| `molecules/` (45+1 data) | Composite controls & micro-charts (FormFields, AreaChart, WorldMap, ProductStage) | ≤ 250 lines per file |
| `organisms/` (19 files) | Complex enterprise modules (BillingPortal, TenantKit, DataTable, BentoShowcase) | Domain-isolated |
| `templates/` (5 files) | Page skeletons (Dashboard, Analytics, Console Table, Settings) | Structural wireframes |
| `views/` (8 files) | Full working SaaS destination pages (Finexy, Billing, Donations, Dev Console) | End-to-end views |
| `libraries/` (15 files) | Interactive showcases of all 295 pattern variants | Reuses `libraries/common/` |
| `libraries/common/` | Shared `LibraryHeader`, `LibrarySegmentControl`, `CodeModal`, `VariantCard` primitives | Eliminates duplicate boilerplate |
| `dashboard/dashboard-shell.tsx` | Master coordinator shell hosting the 6 Atomic Tiers and theme selector | Contains 18 critical test tokens |

---

## 2. Strict Architectural Invariants

1. **One-Way Dependency Flow**:
   - Atoms MUST NOT import Molecules or Organisms.
   - Molecules MUST NOT import Organisms.
   - All components MUST bind to tokens via `useZeroLight()`. Never hardcode raw hex colors or arbitrary px radii.
2. **Deterministic Motion Physics**:
   - Every spring animation MUST bind to `useZeroLight().scaled.motionConfig.spring` or `motionConfig.transition`.
   - Never use raw cubic-bezier strings inside components.
3. **Automated Test Guardrails**:
   - `tests/zerolight.test.mjs` enforces 190 automated assertions across 44 suites.
   - Run `node tests/zerolight.test.mjs` after every modification. All 190 assertions must pass.
   - Run `npx tsc --noEmit` to guarantee 0 TypeScript errors.
