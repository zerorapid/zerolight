#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ZEROLIGHT_DIR = path.join(ROOT, "src", "components", "zerolight");
const REGISTRY_OUT_DIR = path.join(ROOT, "public", "registry");
const SHADCN_OUT_DIR = path.join(ROOT, "public", "r");

const TIER_DIRS = ["atoms", "molecules", "organisms", "templates", "views", "gen-ui"];

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function parseImports(content, filePath) {
  const dependencies = new Set();
  const registryDeps = new Set();
  const importRegex = /from\s+["']([^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const specifier = match[1];
    if (specifier.startsWith(".")) {
      const resolved = path.resolve(path.dirname(filePath), specifier);
      const rel = path.relative(ZEROLIGHT_DIR, resolved).replace(/\\/g, "/");
      if (rel === "" || rel === "index") {
        registryDeps.add("types");
        registryDeps.add("context");
      } else if (rel === "atoms" || rel === "molecules" || rel === "organisms" || rel === "templates" || rel === "views") {
        registryDeps.add(`${rel}-barrel`);
      } else {
        const base = path.basename(rel, path.extname(rel));
        if (base === "index") {
          const parent = path.basename(path.dirname(rel));
          if (parent && parent !== ".") {
            registryDeps.add(`${parent}-barrel`);
          }
        } else {
          registryDeps.add(base);
        }
      }
    } else if (specifier === "@/components/zerolight") {
      registryDeps.add("types");
      registryDeps.add("context");
    } else if (specifier.startsWith("@/components/zerolight/")) {
      const sub = specifier.replace("@/components/zerolight/", "");
      const base = path.basename(sub, path.extname(sub));
      if (TIER_DIRS.includes(base)) {
        registryDeps.add(`${base}-barrel`);
      } else if (base) {
        registryDeps.add(base);
      }
    } else if (!specifier.startsWith("next") && specifier !== "react" && specifier !== "react-dom") {
      const pkg = specifier.startsWith("@")
        ? specifier.split("/").slice(0, 2).join("/")
        : specifier.split("/")[0];
      dependencies.add(pkg);
    }
  }

  return {
    dependencies: Array.from(dependencies).sort(),
    registryDependencies: Array.from(registryDeps).sort(),
  };
}

function collectFiles() {
  const entries = [];

  // Core runtime files
  for (const coreFile of ["types.ts", "context.tsx", "index.ts"]) {
    const fullPath = path.join(ZEROLIGHT_DIR, coreFile);
    if (!fs.existsSync(fullPath)) continue;
    const base = path.basename(coreFile, path.extname(coreFile));
    const name = base === "index" ? "zerolight-index" : base;
    entries.push({ name, tier: "core", filePath: fullPath });
  }

  // Tier component files
  for (const tier of TIER_DIRS) {
    const tierPath = path.join(ZEROLIGHT_DIR, tier);
    if (!fs.existsSync(tierPath)) continue;
    const files = fs.readdirSync(tierPath).sort();
    for (const file of files) {
      if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
      if (file === "index.ts") continue;
      const fullPath = path.join(tierPath, file);
      const name = path.basename(file, path.extname(file));
      entries.push({ name, tier, filePath: fullPath });
    }
  }

  return entries;
}

function main() {
  fs.mkdirSync(REGISTRY_OUT_DIR, { recursive: true });
  fs.mkdirSync(SHADCN_OUT_DIR, { recursive: true });

  // Remove stale registry JSON files before regenerating
  for (const outDir of [REGISTRY_OUT_DIR, SHADCN_OUT_DIR]) {
    for (const existing of fs.readdirSync(outDir)) {
      if (existing.endsWith(".json")) {
        fs.unlinkSync(path.join(outDir, existing));
      }
    }
  }

  const collected = collectFiles();
  const seenNames = new Set();
  const indexItems = [];
  const shadcnItems = [];
  const tierCounts = { core: 0, atoms: 0, molecules: 0, organisms: 0, templates: 0, views: 0, tools: 0, "gen-ui": 0 };

  for (const item of collected) {
    if (seenNames.has(item.name)) {
      throw new Error(`Duplicate registry component name detected: "${item.name}" at ${item.filePath}`);
    }
    seenNames.add(item.name);

    const content = fs.readFileSync(item.filePath, "utf-8");
    const relFromRoot = path.relative(ROOT, item.filePath).replace(/\\/g, "/");
    const { dependencies, registryDependencies } = parseImports(content, item.filePath);
    const cleanRegistryDeps = registryDependencies.filter(
      (dep) => dep !== item.name && !dep.endsWith("-barrel")
    );
    const lines = content.split("\n").length;

    const itemPayload = {
      $schema: "https://zerolight.dev/schema/registry-item.json",
      name: item.name,
      title: toTitleCase(item.name),
      type: item.tier === "core" ? "registry:lib" : "registry:ui",
      tier: item.tier,
      dependencies,
      registryDependencies: cleanRegistryDeps,
      files: [
        {
          path: relFromRoot,
          content,
        },
      ],
    };

    fs.writeFileSync(
      path.join(REGISTRY_OUT_DIR, `${item.name}.json`),
      JSON.stringify(itemPayload, null, 2) + "\n",
      "utf-8"
    );

    const shadcnItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.tier === "core" ? "registry:lib" : "registry:component",
      title: itemPayload.title,
      dependencies,
      registryDependencies: cleanRegistryDeps,
      files: [
        {
          path: relFromRoot,
          content,
          type: item.tier === "core" ? "registry:lib" : "registry:component",
        },
      ],
    };

    fs.writeFileSync(
      path.join(SHADCN_OUT_DIR, `${item.name}.json`),
      JSON.stringify(shadcnItem, null, 2) + "\n",
      "utf-8"
    );

    shadcnItems.push({
      name: item.name,
      type: shadcnItem.type,
      title: shadcnItem.title,
      dependencies,
      registryDependencies: cleanRegistryDeps,
      files: [{ path: relFromRoot, type: shadcnItem.type }],
    });

    indexItems.push({
      name: item.name,
      title: itemPayload.title,
      type: itemPayload.type,
      tier: item.tier,
      targetPath: relFromRoot,
      dependencies,
      registryDependencies: cleanRegistryDeps,
      lines,
      registryUrl: `/registry/${item.name}.json`,
      shadcnUrl: `/r/${item.name}.json`,
    });

    tierCounts[item.tier] = (tierCounts[item.tier] || 0) + 1;
  }

  const indexPayload = {
    name: "zerolight",
    version: "0.1.0",
    totalCount: indexItems.length,
    tiers: tierCounts,
    items: indexItems,
  };

  fs.writeFileSync(
    path.join(REGISTRY_OUT_DIR, "index.json"),
    JSON.stringify(indexPayload, null, 2) + "\n",
    "utf-8"
  );

  const shadcnRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "zerolight",
    homepage: "https://zerolight.dev",
    items: shadcnItems,
  };

  fs.writeFileSync(
    path.join(SHADCN_OUT_DIR, "index.json"),
    JSON.stringify(shadcnRegistry, null, 2) + "\n",
    "utf-8"
  );

  // Generate public/llms-full.txt with exact TypeScript prop interfaces for AI web chats
  const llmsFullLines = [
    "# ZeroLight Design System — Complete Component & Prop Reference (llms-full.txt)",
    "",
    `> Generated automatically from source files (${indexItems.length} items). Public registry: https://bricks.zerorapid.in/r/index.json`,
    "",
    "## AI Prompt-to-Tier Governance (Read Before Generating UI)",
    "",
    "Match the user's prompt to ONE complexity tier instead of blindly dumping heavy organisms:",
    "",
    "1. **Tier 1 — Simple Dashboard (`simple`)**: For prompts like 'simple dashboard', 'overview page', 'KPI tracker'.",
    "   - Allowed: `StatCard` (max 4), `AreaChart` or `BarChart` (max 1), `DataTable` or `Card` (max 1), `Button`, `Badge`.",
    "   - Forbidden: `GeoBreakdown`, `ApprovalWorkflow`, `LineItemMatrix`, `ThreeWayMatch`, `LedgerBalancer`.",
    "2. **Tier 2 — Operational Console (`operational`)**: For prompts like 'inventory manager', 'billing portal', 'support desk'.",
    "   - Allowed: Tier 1 + `InventoryStockHealth`, `BillingPortal`, `FilterBar`, `DetailDrawer`, `Modal`.",
    "   - Rule: Max 2 primary workspaces visible at once; place secondary details inside `DetailDrawer` or `Modal`.",
    "3. **Tier 3 — Enterprise Desk (`enterprise`)**: For prompts like 'supply chain & PO desk', '3-way invoice match ERP', 'multi-tenant RBAC'.",
    "   - Allowed: Full organisms (`GeoBreakdown`, `LineItemMatrix`, `ApprovalWorkflow`, `LedgerBalancer`, `ThreeWayMatch`, `TenantKit`, `TeamPermissions`).",
    "   - Layout Rules: `GeoBreakdown` MUST span `lg:col-span-8` or `lg:col-span-12` (never pair two competing regional cards side-by-side); use ISO country IDs (`US`, `GB`, `IN`, `DE`, `SG`) or `compactMode=\"auto\"` on `WorldMap`.",
    "4. **Iconography (`lucide-react`)**: ZeroLight ships with `lucide-react`. Always pass crisp `lucide-react` icons into `StatCard` (`icon={<Package className=\"w-4 h-4\" />}`) and primary `Button`s (`iconLeft={<Plus className=\"w-3.5 h-3.5\" />}`) for instant visual hierarchy—never use raw `+` text or decorative emojis.",
    "",
  ];

  for (const item of indexItems) {
    const itemJsonPath = path.join(REGISTRY_OUT_DIR, `${item.name}.json`);
    const itemData = JSON.parse(fs.readFileSync(itemJsonPath, "utf-8"));
    const tsxContent = (itemData.files && itemData.files[0] && itemData.files[0].content) || "";
    const propsMatches = tsxContent.match(/export\s+interface\s+\w*Props[\s\S]*?\n\}/g) || [];
    const fnMatches = tsxContent.match(/export\s+(?:function|const)\s+[A-Z]\w*/g) || [];

    llmsFullLines.push(`## ${item.name} (${item.type})`);
    llmsFullLines.push(`- Install: \`npx zerolight add ${item.name}\``);
    llmsFullLines.push(`- Registry JSON: https://bricks.zerorapid.in/r/${item.name}.json`);
    if (fnMatches.length > 0) {
      llmsFullLines.push(`- Exports: ${fnMatches.map((m) => m.replace(/export\s+(?:function|const)\s+/, "")).join(", ")}`);
    }
    if (propsMatches.length > 0) {
      llmsFullLines.push("```ts");
      llmsFullLines.push(propsMatches.join("\n\n"));
      llmsFullLines.push("```");
    }
    llmsFullLines.push("");
  }

  fs.writeFileSync(
    path.join(ROOT, "public", "llms-full.txt"),
    llmsFullLines.join("\n"),
    "utf-8"
  );

  // Generate concise /llms.txt router + domain-specific /llms/*.txt slices
  const llmsDir = path.join(ROOT, "public", "llms");
  fs.mkdirSync(llmsDir, { recursive: true });

  const domainBuckets = {
    core: [],
    charts: [],
    ai: [],
    enterprise: [],
    erp: [],
    blocks: [],
  };

  for (const item of indexItems) {
    const n = item.name.toLowerCase();
    const itemJsonPath = path.join(REGISTRY_OUT_DIR, `${item.name}.json`);
    const itemData = JSON.parse(fs.readFileSync(itemJsonPath, "utf-8"));
    const tsxContent = (itemData.files && itemData.files[0] && itemData.files[0].content) || "";
    const propsMatches = tsxContent.match(/export\s+interface\s+\w*Props[\s\S]*?\n\}/g) || [];
    const entry = [
      `## ${item.name} (${item.type})`,
      `- Install: \`npx zerolight add ${item.name}\``,
      `- Registry: https://bricks.zerorapid.in/r/${item.name}.json`,
      ...(propsMatches.length > 0 ? ["```ts", propsMatches.join("\n\n"), "```"] : []),
      "",
    ].join("\n");

    if (item.type === "registry:block" || n.endsWith("-block") || n.endsWith("-template") || n.endsWith("-view")) {
      domainBuckets.blocks.push(entry);
    } else if (/chart|sparkline|heatmap|gauge|world-map|geo-breakdown|stat-card/.test(n)) {
      domainBuckets.charts.push(entry);
    } else if (/chat|typing|message|gen-ui|ai-assistant/.test(n)) {
      domainBuckets.ai.push(entry);
    } else if (/ledger|three-way|line-item|approval|inventory-stock|donations/.test(n)) {
      domainBuckets.erp.push(entry);
    } else if (/billing|tenant|permission|audit|data-table|command-palette|sign-in/.test(n)) {
      domainBuckets.enterprise.push(entry);
    } else {
      domainBuckets.core.push(entry);
    }
  }

  for (const [bucket, entries] of Object.entries(domainBuckets)) {
    fs.writeFileSync(
      path.join(llmsDir, `${bucket}.txt`),
      `# ZeroLight Design System — ${bucket.toUpperCase()} Reference (${entries.length} items)\n\n${entries.join("\n")}`,
      "utf-8"
    );
  }

  const llmsRouter = [
    "# ZeroLight Design System",
    "",
    `> Source-installable React design system for SaaS, AI, and Enterprise apps (${indexItems.length} registry items).`,
    "",
    "## Default AI Workflow",
    "1. Match user intent to a tier (`simple`, `operational`, `enterprise`).",
    "2. Prefer an existing `block/...` or template before composing from scratch.",
    "3. Bind all colors, radii, and motion to `useZeroLight()` tokens.",
    "4. Use `lucide-react` icons on `StatCard` (`icon`) and primary `Button`s (`iconLeft`).",
    "5. Use `tabular-nums` with `font-sans` for KPIs, currency, and counts.",
    "",
    "## Domain References",
    `- Core UI (${domainBuckets.core.length}): https://bricks.zerorapid.in/llms/core.txt`,
    `- Charts & Geo (${domainBuckets.charts.length}): https://bricks.zerorapid.in/llms/charts.txt`,
    `- AI & Chat (${domainBuckets.ai.length}): https://bricks.zerorapid.in/llms/ai.txt`,
    `- Enterprise SaaS (${domainBuckets.enterprise.length}): https://bricks.zerorapid.in/llms/enterprise.txt`,
    `- ERP & Supply Chain (${domainBuckets.erp.length}): https://bricks.zerorapid.in/llms/erp.txt`,
    `- Full-Page Blocks (${domainBuckets.blocks.length}): https://bricks.zerorapid.in/llms/blocks.txt`,
    `- Product DNA (Archetypes, Entities & State Machines): https://bricks.zerorapid.in/llms/product-dna.txt`,
    `- Complete Reference: https://bricks.zerorapid.in/llms-full.txt`,
    `- Registry Index: https://bricks.zerorapid.in/r/index.json`,
    "",
  ].join("\n");

  fs.writeFileSync(path.join(ROOT, "public", "llms.txt"), llmsRouter, "utf-8");

  const productDnaPath = path.join(ROOT, "src", "components", "zerolight", "product-dna.ts");
  if (fs.existsSync(productDnaPath)) {
    fs.writeFileSync(
      path.join(llmsDir, "product-dna.txt"),
      `# ZeroLight Product DNA (Levels 4-6: Archetypes, Entities, State Machines & ZP001-ZP025)\n\n\`\`\`ts\n${fs.readFileSync(productDnaPath, "utf-8")}\n\`\`\`\n`,
      "utf-8"
    );
  }

  console.log(
    `Built ZeroLight registry: ${indexItems.length} items (${Object.entries(tierCounts)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}) -> public/registry/, public/r/, public/llms.txt & public/llms/*.txt`
  );
}

main();
