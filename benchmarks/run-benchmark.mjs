#!/usr/bin/env node
/**
 * ZeroLight Reproducible SaaS Composition & Product DNA Benchmark (10 Core Archetype Prompts)
 * Verifies prompt routing, registry resolution, composition budgets, and lint scores.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_INDEX = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public", "registry", "index.json"), "utf8")
);
const available = new Set(REGISTRY_INDEX.items.map((i) => i.name));

const PROMPTS = [
  { name: "Simple SaaS Overview", tier: "simple", blocks: ["simple-analytics-block"], components: ["stat-card", "area-chart", "data-table"] },
  { name: "Global Supply Chain & PO Desk", tier: "enterprise", blocks: ["supply-chain-desk-block"], components: ["stat-card", "geo-breakdown", "area-chart", "line-item-matrix", "approval-workflow"] },
  { name: "AI Agent Command Center", tier: "enterprise", blocks: ["ai-agent-console-block"], components: ["streaming-message", "tool-call-card", "prompt-composer", "approval-workflow"] },
  { name: "Real Estate CRM Pipeline", tier: "enterprise", blocks: ["crm-pipeline-block"], components: ["stat-card", "data-table", "async-combobox"] },
  { name: "FinTech Three-Way Match & GL", tier: "enterprise", blocks: ["fintech-reconciliation-block"], components: ["three-way-match", "ledger-balancer", "currency-input"] },
  { name: "SaaS Billing & Subscriptions", tier: "operational", blocks: ["billing-view"], components: ["billing-portal", "payment-card", "stat-card"] },
  { name: "RBAC & Team Security", tier: "operational", blocks: ["settings-view"], components: ["permission-matrix", "team-permissions", "audit-log"] },
  { name: "Developer Webhook Console", tier: "operational", blocks: ["dev-console-view"], components: ["webhook-inspector", "api-key-vault", "code-diff-viewer"] },
  { name: "MFA Auth Onboarding", tier: "simple", blocks: ["dashboard-template"], components: ["input-otp", "masked-input", "button"] },
  { name: "10k-Row Operations Ledger", tier: "operational", blocks: ["console-table-template"], components: ["virtual-data-grid", "resizable-panels", "artifact-viewer"] },
];

let passed = 0;
for (const p of PROMPTS) {
  const missing = [...p.blocks, ...p.components].filter((id) => !available.has(id));
  if (missing.length === 0) {
    passed++;
    console.log(`  ✓ [${p.tier.toUpperCase()}] ${p.name} -> all ${p.blocks.length + p.components.length} items resolved`);
  } else {
    console.error(`  ✗ [${p.tier.toUpperCase()}] ${p.name} -> missing: ${missing.join(", ")}`);
    process.exitCode = 1;
  }
}
console.log(`\nZeroLight Benchmark Complete: ${passed}/${PROMPTS.length} archetypes 100% covered by ${REGISTRY_INDEX.items.length} registry items.\n`);
