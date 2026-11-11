#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ZEROLIGHT_DIR = path.join(ROOT, "src", "components", "zerolight");
const REGISTRY_OUT_DIR = path.join(ROOT, "public", "registry");

const TIER_DIRS = ["atoms", "molecules", "organisms", "templates", "views"];

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

  // Remove stale registry JSON files before regenerating
  for (const existing of fs.readdirSync(REGISTRY_OUT_DIR)) {
    if (existing.endsWith(".json")) {
      fs.unlinkSync(path.join(REGISTRY_OUT_DIR, existing));
    }
  }

  const collected = collectFiles();
  const seenNames = new Set();
  const indexItems = [];
  const tierCounts = { core: 0, atoms: 0, molecules: 0, organisms: 0, templates: 0, views: 0 };

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

  console.log(
    `Built ZeroLight registry: ${indexItems.length} items (${Object.entries(tierCounts)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}) -> public/registry/`
  );
}

main();
