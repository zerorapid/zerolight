#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";

const PKG_VERSION = "0.1.0";
const DEFAULT_REGISTRY_BASE = process.env.ZEROLIGHT_REGISTRY_URL || "https://raw.githubusercontent.com/zerorapid/zerolight/main/public/registry";

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
    force: false,
    yes: false,
  };

  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") {
      flags.outDir = path.resolve(argv[++i]);
    } else if (a === "--registry" || a === "-r") {
      flags.localRegistry = path.resolve(argv[++i]);
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
    client.get(url, (res) => {
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

async function loadRegistryIndex(localRegistry) {
  if (localRegistry && fs.existsSync(path.join(localRegistry, "index.json"))) {
    return JSON.parse(fs.readFileSync(path.join(localRegistry, "index.json"), "utf8"));
  }
  const fallbackLocal = path.join(process.cwd(), "public", "registry", "index.json");
  if (fs.existsSync(fallbackLocal)) {
    return JSON.parse(fs.readFileSync(fallbackLocal, "utf8"));
  }
  return fetchJson(`${DEFAULT_REGISTRY_BASE}/index.json`);
}

async function loadRegistryItem(name, localRegistry) {
  if (localRegistry) {
    const localFile = path.join(localRegistry, `${name}.json`);
    if (fs.existsSync(localFile)) {
      return JSON.parse(fs.readFileSync(localFile, "utf8"));
    }
  }
  const fallbackLocal = path.join(process.cwd(), "public", "registry", `${name}.json`);
  if (fs.existsSync(fallbackLocal)) {
    return JSON.parse(fs.readFileSync(fallbackLocal, "utf8"));
  }
  return fetchJson(`${DEFAULT_REGISTRY_BASE}/${name}.json`);
}

async function handleInit(flags) {
  console.log(`\x1b[36mInitializing ZeroLight in\x1b[0m: ${flags.outDir}`);
  const targetDir = path.join(flags.outDir, "src", "components", "zerolight");
  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`Fetching core foundation tokens and context...`);
  const coreItems = ["types", "context", "utils"];
  for (const item of coreItems) {
    try {
      const data = await loadRegistryItem(item, flags.localRegistry);
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

  console.log(`\n\x1b[32m✓ ZeroLight initialized successfully.\x1b[0m`);
  console.log(`Add components anytime using:`);
  console.log(`  \x1b[35mnpx zerolight add button stat-card data-table world-map\x1b[0m\n`);
}

async function handleList(flags) {
  try {
    const index = await loadRegistryIndex(flags.localRegistry);
    console.log(`Available ZeroLight Primitives (${index.items.length} items total):\n`);
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
    const name = queue.shift();
    if (!name || visited.has(name)) continue;
    visited.add(name);

    try {
      const item = await loadRegistryItem(name, flags.localRegistry);
      for (const dep of item.dependencies || []) {
        npmDeps.add(dep);
      }
      for (const regDep of item.registryDependencies || []) {
        if (!visited.has(regDep)) {
          queue.push(regDep);
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
    case "help":
    default:
      console.log(`Usage:
  npx zerolight init [--out <dir>]
  npx zerolight list
  npx zerolight add <component-name...> [--out <dir>]

Examples:
  npx zerolight add button stat-card data-table
  npx zerolight add world-map geo-breakdown
  npx zerolight add modal popover tabs toolbar
`);
      break;
  }
}

main().catch((err) => {
  console.error("\x1b[31mFatal error:\x1b[0m", err);
  process.exit(1);
});
