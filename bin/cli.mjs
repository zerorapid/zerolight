#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";

const PKG_VERSION = "0.1.1";
const DEFAULT_REGISTRY_BASE = process.env.ZERORAPID_REGISTRY_URL || process.env.ZEROLIGHT_REGISTRY_URL || "https://bricks.zerorapid.in/registry";
const DEFAULT_SHADCN_REGISTRY_BASE = process.env.ZEROLIGHT_SHADCN_REGISTRY_URL || "https://bricks.zerorapid.in/r";
const GITHUB_REGISTRY_FALLBACK = "https://raw.githubusercontent.com/zerorapid/zerolight/main/public/registry";
const GITHUB_SHADCN_FALLBACK = "https://raw.githubusercontent.com/zerorapid/zerolight/main/public/r";

const BLOCK_ALIASES = {
  "block/billing-portal": "billing-portal",
  "block/tenant-kit": "tenant-kit",
  "block/team-permissions": "team-permissions",
  "block/geo-breakdown": "geo-breakdown",
  "block/data-table": "data-table",
  "block/bento-showcase": "bento-showcase",
  "block/approval-workflow": "approval-workflow",
  "block/three-way-match": "three-way-match",
  "block/ledger-balancer": "ledger-balancer",
  "block/line-item-matrix": "line-item-matrix",
  "block/inventory-stock-health": "inventory-stock-health",
  "block/simple-analytics": "simple-analytics-block",
  "block/analytics/simple-overview": "simple-analytics-block",
  "block/supply-chain-desk": "supply-chain-desk-block",
  "block/supply-chain/po-desk": "supply-chain-desk-block",
  "block/saas/billing-portal": "billing-portal",
  "block/saas/admin-console": "team-permissions",
  "block/fintech/reconciliation-desk": "three-way-match",
  "block/erp/general-ledger": "ledger-balancer",
  "block/ai/agent-command-center": "ai-agent-console-block",
  "block/crm/sales-pipeline": "crm-pipeline-block",
  "block/fintech/reconciliation-workbench": "fintech-reconciliation-block",
};

function printBanner() {
  console.log(`
\x1b[38;2;16;185;129m┌────────────────────────────────────────────────────────┐
│  ZEROLIGHT CLI v${PKG_VERSION} — Bulletproof SaaS UI Engine   │
└────────────────────────────────────────────────────────┘\x1b[0m
`);
}

function parseArgs(argv) {
  const flags = {
    command: argv[0] || "help",
    components: [],
    outDir: process.cwd(),
    localRegistry: null,
    shadcn: false,
    force: false,
    yes: false,
    withSkill: false,
    tier: "simple",
    preset: null,
    noTelemetry: process.env.ZEROLIGHT_TELEMETRY === "0",
  };

  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") {
      flags.outDir = path.resolve(argv[++i]);
    } else if (a === "--registry" || a === "-r") {
      flags.localRegistry = path.resolve(argv[++i]);
    } else if (a === "--shadcn") {
      flags.shadcn = true;
    } else if (a === "--with-skill") {
      flags.withSkill = true;
    } else if (a === "--tier") {
      flags.tier = argv[++i] || "simple";
    } else if (a === "--preset") {
      flags.preset = argv[++i] || null;
    } else if (a === "--no-telemetry") {
      flags.noTelemetry = true;
    } else if (a === "--force" || a === "-f") {
      flags.force = true;
    } else if (a === "-y" || a === "--yes") {
      flags.yes = true;
    } else if (!a.startsWith("-")) {
      flags.components.push(a);
    }
  }

  return flags;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const headers = {};
    if (process.env.ZERORAPID_REGISTRY_TOKEN) {
      headers["x-zerolight-token"] = process.env.ZERORAPID_REGISTRY_TOKEN;
    }
    client.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJson(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} when fetching ${url}`));
      }
      let raw = "";
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

async function loadRegistryIndex(localRegistry, useShadcn = false) {
  if (localRegistry && fs.existsSync(path.join(localRegistry, "index.json"))) {
    return JSON.parse(fs.readFileSync(path.join(localRegistry, "index.json"), "utf8"));
  }
  const subDir = useShadcn ? "r" : "registry";
  const fallbackLocal = path.join(process.cwd(), "public", subDir, "index.json");
  if (fs.existsSync(fallbackLocal)) {
    return JSON.parse(fs.readFileSync(fallbackLocal, "utf8"));
  }
  const remoteBase = useShadcn ? DEFAULT_SHADCN_REGISTRY_BASE : DEFAULT_REGISTRY_BASE;
  const fallbackRemote = useShadcn ? GITHUB_SHADCN_FALLBACK : GITHUB_REGISTRY_FALLBACK;
  try {
    return await fetchJson(`${remoteBase}/index.json`);
  } catch {
    return fetchJson(`${fallbackRemote}/index.json`);
  }
}

async function loadRegistryItem(name, localRegistry, useShadcn = false) {
  if (localRegistry) {
    const localFile = path.join(localRegistry, `${name}.json`);
    if (fs.existsSync(localFile)) {
      return JSON.parse(fs.readFileSync(localFile, "utf8"));
    }
  }
  const subDir = useShadcn ? "r" : "registry";
  const fallbackLocal = path.join(process.cwd(), "public", subDir, `${name}.json`);
  if (fs.existsSync(fallbackLocal)) {
    return JSON.parse(fs.readFileSync(fallbackLocal, "utf8"));
  }
  const remoteBase = useShadcn ? DEFAULT_SHADCN_REGISTRY_BASE : DEFAULT_REGISTRY_BASE;
  const fallbackRemote = useShadcn ? GITHUB_SHADCN_FALLBACK : GITHUB_REGISTRY_FALLBACK;
  try {
    return await fetchJson(`${remoteBase}/${name}.json`);
  } catch {
    return fetchJson(`${fallbackRemote}/${name}.json`);
  }
}

async function handleInit(flags) {
  console.log(`\x1b[36mInitializing ZeroLight in\x1b[0m: ${flags.outDir}`);
  const targetDir = path.join(flags.outDir, "src", "components", "zerolight");
  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`Fetching core foundation tokens and context...`);
  const coreItems = ["types", "context", "utils"];
  for (const item of coreItems) {
    try {
      const data = await loadRegistryItem(item, flags.localRegistry, flags.shadcn);
      for (const file of data.files || []) {
        const dest = path.join(flags.outDir, file.path);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, file.content, "utf8");
        console.log(`  \x1b[32m+\x1b[0m ${path.relative(flags.outDir, dest)}`);
      }
    } catch (e) {
      console.warn(`  \x1b[33m!\x1b[0m Could not install core item "${item}": ${e.message}`);
    }
  }

  // Write zerolight.config.json for tier governance & preset reproducibility
  let parsedPreset = null;
  if (flags.preset) {
    try {
      parsedPreset = JSON.parse(Buffer.from(flags.preset, "base64").toString("utf8"));
    } catch {
      parsedPreset = { name: flags.preset };
    }
  }
  const configPath = path.join(flags.outDir, "zerolight.config.json");
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      {
        version: PKG_VERSION,
        tier: flags.tier,
        preset: parsedPreset,
        registry: flags.shadcn ? "https://bricks.zerorapid.in/r" : "https://bricks.zerorapid.in/registry",
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
  console.log(`  \x1b[32m+\x1b[0m zerolight.config.json (tier: ${flags.tier})`);

  if (flags.withSkill) {
    const skillDir = path.join(flags.outDir, ".claude", "skills", "zerolight");
    fs.mkdirSync(skillDir, { recursive: true });
    const skillPath = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillPath,
      `---
name: zerolight
description: ZeroLight Design System governance skill. Enforces token invariants, Prompt-to-Tier component budgets, and layout rules.
---

# ZeroLight Design System Rules

1. **Token Invariant**: Never hardcode hex colors or pixel radii. Always read from \`useZeroLight()\`.
2. **Active Tier Budget (\`${flags.tier}\`)**:
   - \`simple\`: Max 4 \`StatCard\`, 1 Chart (\`AreaChart\`/\`BarChart\`), 1 \`DataTable\`, \`Button\`, \`Badge\`. Do NOT add \`GeoBreakdown\` or \`ApprovalWorkflow\`.
   - \`operational\`: Simple + \`InventoryStockHealth\`, \`BillingPortal\`, \`DetailDrawer\`, \`Modal\`.
   - \`enterprise\`: Full organisms (\`GeoBreakdown\`, \`LineItemMatrix\`, \`ApprovalWorkflow\`, \`ThreeWayMatch\`, \`LedgerBalancer\`). \`GeoBreakdown\` MUST span \`lg:col-span-8\` or \`lg:col-span-12\`.
3. **Typography**: Use \`tabular-nums\` with \`font-sans\` for KPIs, currency, and counts.
`,
      "utf8"
    );
    console.log(`  \x1b[32m+\x1b[0m .claude/skills/zerolight/SKILL.md`);
  }

  console.log(`\n\x1b[32m✓ ZeroLight initialized successfully.\x1b[0m`);
  console.log(`Add components anytime using:`);
  console.log(`  \x1b[35mnpx zerolight add button stat-card data-table world-map\x1b[0m\n`);
}

async function handleList(flags) {
  try {
    const index = await loadRegistryIndex(flags.localRegistry, flags.shadcn);
    console.log(`Available ZeroLight Primitives (${index.items.length} items total${flags.shadcn ? ", shadcn format" : ""}):\n`);
    const byType = {};
    for (const item of index.items) {
      const t = item.type || "other";
      byType[t] = byType[t] || [];
      byType[t].push(item.name);
    }
    for (const [type, names] of Object.entries(byType)) {
      console.log(`\x1b[36m[${type}]\x1b[0m (${names.length})`);
      console.log(`  ${names.sort().join(", ")}\n`);
    }
  } catch (e) {
    console.error(`\x1b[31mFailed to load registry index\x1b[0m: ${e.message}`);
  }
}

function reportTelemetry(componentsUsed, noTelemetry) {
  if (noTelemetry || componentsUsed.length === 0) return;
  try {
    const payload = JSON.stringify({
      intent: `cli:add (${componentsUsed.join(", ")})`,
      source: "human_studio",
      componentsUsed,
    });
    const req = https.request(
      "https://bricks.zerorapid.in/api/telemetry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 1500,
      },
      () => {}
    );
    req.on("error", () => {});
    req.on("timeout", () => req.destroy());
    req.write(payload);
    req.end();
  } catch {
    // Non-blocking telemetry
  }
}

async function handleAdd(flags) {
  if (flags.components.length === 0) {
    console.log("Please specify one or more components to add.");
    console.log("Example: npx zerolight add button stat-card world-map");
    return;
  }

  const queue = [...flags.components];
  const visited = new Set();
  const npmDeps = new Set();
  const writtenFiles = [];

  console.log(`Resolving components & registry dependencies...`);

  while (queue.length > 0) {
    const rawName = queue.shift();
    const name = BLOCK_ALIASES[rawName] || rawName.replace(/^block\//, "");
    if (!name || visited.has(name)) continue;
    visited.add(name);

    try {
      const item = await loadRegistryItem(name, flags.localRegistry, flags.shadcn);
      for (const dep of item.dependencies || []) {
        npmDeps.add(dep);
      }
      for (const regDep of item.registryDependencies || []) {
        const depName = regDep.startsWith("@zerolight/")
          ? regDep.slice("@zerolight/".length)
          : regDep.replace(/\.json$/, "").split("/").pop();
        if (depName && !visited.has(depName)) {
          queue.push(depName);
        }
      }

      for (const file of item.files || []) {
        const dest = path.join(flags.outDir, file.path);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, file.content, "utf8");
        writtenFiles.push(path.relative(flags.outDir, dest));
      }
    } catch (e) {
      console.error(`\x1b[31mError fetching "${name}"\x1b[0m: ${e.message}`);
    }
  }

  console.log(`\n\x1b[32m✓ Successfully added ${visited.size} component(s):\x1b[0m`);
  for (const f of writtenFiles) {
    console.log(`  \x1b[32m+\x1b[0m ${f}`);
  }

  if (npmDeps.size > 0) {
    console.log(`\nRequired npm packages:`);
    console.log(`  \x1b[33mnpm install ${Array.from(npmDeps).join(" ")}\x1b[0m\n`);
  }

  reportTelemetry(Array.from(visited), flags.noTelemetry);
}

function handleArchitect(flags) {
  const prompt = flags.components.join(" ").trim();
  if (!prompt) {
    console.log('Example: npx zerolight architect "Build a real estate CRM SaaS"');
    return;
  }
  const p = prompt.toLowerCase();
  let archetype = "subscription-saas";
  if (/crm|real estate|lead|pipeline|sales|deal/.test(p)) archetype = "crm";
  else if (/supply chain|procurement|purchase order|\bpo\b|vendor|supplier/.test(p)) archetype = "procurement";
  else if (/agent|copilot|ai assistant|llm|tool call/.test(p)) archetype = "ai-agent-platform";
  else if (/helpdesk|support|ticket|inbox/.test(p)) archetype = "helpdesk";
  else if (/ledger|accounting|reconciliation|three[- ]?way|erp|fintech/.test(p)) archetype = "erp";

  const map = {
    crm: { nav: "entity-centric", entities: "Account, Lead, Deal, Activity", routes: "/overview, /leads, /deals, /deals/[id], /settings/team", add: "stat-card data-table async-combobox detail-drawer approval-workflow" },
    procurement: { nav: "module-centric", entities: "Supplier, PurchaseOrder, GoodsReceipt", routes: "/control-tower, /purchase-orders, /purchase-orders/[id], /suppliers", add: "block/supply-chain/po-desk" },
    "ai-agent-platform": { nav: "conversation-centric", entities: "Conversation, AgentRun, ToolCall", routes: "/workspace, /approvals", add: "block/ai/agent-command-center" },
    helpdesk: { nav: "inbox-centric", entities: "Ticket, Customer, Reply", routes: "/inbox, /inbox/[id]", add: "data-table detail-drawer streaming-message prompt-composer" },
    erp: { nav: "module-centric", entities: "LedgerEntry, InvoiceMatch", routes: "/ledger, /reconciliation", add: "block/fintech/reconciliation-desk block/erp/general-ledger" },
    "subscription-saas": { nav: "workspace-centric", entities: "Organization, Subscription, Invoice", routes: "/dashboard, /billing, /team", add: "block/saas/billing-portal block/saas/admin-console" },
  }[archetype];

  console.log(`\x1b[36mZeroLight Product DNA Blueprint\x1b[0m`);
  console.log(`  Archetype:  ${archetype}`);
  console.log(`  Navigation: ${map.nav}`);
  console.log(`  Entities:   ${map.entities}`);
  console.log(`  Routes:     ${map.routes}`);
  console.log(`  Install:    \x1b[32mnpx zerolight add ${map.add}\x1b[0m\n`);
}

function handleLint(flags) {
  const target = flags.components[0] ? path.resolve(flags.outDir, flags.components[0]) : path.join(flags.outDir, "src", "app");
  if (!fs.existsSync(target)) {
    console.error(`\x1b[31mPath not found:\x1b[0m ${target}`);
    process.exit(1);
  }
  const files = [];
  const walk = (p) => {
    const stat = fs.statSync(p);
    if (stat.isFile() && /\.(tsx|jsx)$/.test(p)) files.push(p);
    else if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(p)) {
        if (!["node_modules", ".next"].includes(entry)) walk(path.join(p, entry));
      }
    }
  };
  walk(target);

  let warnings = 0;
  let errors = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const rel = path.relative(flags.outDir, file);
    const hexMatches = src.match(/#[0-9A-Fa-f]{6}\b/g) || [];
    if (hexMatches.length > 0 && src.includes("zerolight")) {
      warnings++;
      console.log(`  \x1b[33mZL001\x1b[0m ${rel}: Found ${hexMatches.length} hardcoded hex color(s) (${hexMatches.slice(0, 3).join(", ")}). Use useZeroLight() tokens.`);
    }
    const primaryMatches = src.match(/variant=["']primary["']/g) || [];
    if (primaryMatches.length > 2) {
      warnings++;
      console.log(`  \x1b[33mZL008\x1b[0m ${rel}: ${primaryMatches.length} primary buttons found. Keep 1 dominant primary CTA per viewport.`);
    }
    const statCards = src.match(/<StatCard\b/g) || [];
    if (statCards.length > 4) {
      warnings++;
      console.log(`  \x1b[33mZL009\x1b[0m ${rel}: ${statCards.length} StatCards exceeds recommended 4-card budget.`);
    }
    if (/\bfont-mono\b/.test(src) && src.includes("StatCard")) {
      warnings++;
      console.log(`  \x1b[33mZL016\x1b[0m ${rel}: Avoid font-mono on KPIs/metrics; use font-sans tabular-nums.`);
    }
  }
  const score = Math.max(0, 100 - errors * 15 - warnings * 5);
  console.log(`\nZeroLight Inspector: scanned ${files.length} file(s) — Score ${score}/100 (${errors} errors, ${warnings} warnings)\n`);
}

async function main() {
  printBanner();
  const flags = parseArgs(process.argv.slice(2));

  switch (flags.command) {
    case "init":
      await handleInit(flags);
      break;
    case "list":
    case "ls":
      await handleList(flags);
      break;
    case "add":
      await handleAdd(flags);
      break;
    case "lint":
      handleLint(flags);
      break;
    case "architect":
      handleArchitect(flags);
      break;
    case "help":
    default:
      console.log(`Usage:
  npx zerolight init [--out <dir>] [--shadcn] [--with-skill] [--tier simple|operational|enterprise]
  npx zerolight architect "<product-prompt>"
  npx zerolight list [--shadcn]
  npx zerolight add <component-name...> [--out <dir>] [--shadcn]
  npx zerolight lint [path]

Options:
  --shadcn   Use shadcn-compatible public/r/ registry payloads
  --out, -o  Target project root directory (defaults to cwd)
  --registry Override local registry directory

Examples:
  npx zerolight add button stat-card data-table
  npx zerolight add world-map geo-breakdown --shadcn
  npx zerolight add modal popover tabs toolbar
`);
      break;
  }
}

main().catch((err) => {
  console.error("\x1b[31mFatal error:\x1b[0m", err);
  process.exit(1);
});
