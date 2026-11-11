#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "public", "registry");

function parseArgs(argv) {
  const components = [];
  let outDir = ROOT;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out" || arg === "-o") {
      outDir = path.resolve(argv[++i] || ROOT);
    } else if (!arg.startsWith("-")) {
      components.push(arg);
    }
  }

  return { components, outDir };
}

function loadItem(name) {
  const itemPath = path.join(REGISTRY_DIR, `${name}.json`);
  if (!fs.existsSync(itemPath)) {
    throw new Error(`Registry item "${name}" not found in ${REGISTRY_DIR}. Run "npm run registry" first.`);
  }
  return JSON.parse(fs.readFileSync(itemPath, "utf-8"));
}

function main() {
  const { components, outDir } = parseArgs(process.argv.slice(2));
  if (components.length === 0) {
    console.log("Usage: node scripts/add-component.mjs <component-name...> [--out <target-project-root>]");
    process.exit(1);
  }

  const queue = [...components];
  const visited = new Set();
  const npmDeps = new Set();
  const writtenFiles = [];

  while (queue.length > 0) {
    const name = queue.shift();
    if (!name || visited.has(name)) continue;
    visited.add(name);

    const item = loadItem(name);
    for (const dep of item.dependencies || []) {
      npmDeps.add(dep);
    }
    for (const regDep of item.registryDependencies || []) {
      if (!visited.has(regDep)) {
        queue.push(regDep);
      }
    }

    for (const file of item.files || []) {
      const destPath = path.join(outDir, file.path);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, file.content, "utf-8");
      writtenFiles.push(path.relative(outDir, destPath));
    }
  }

  console.log(`Installed ${visited.size} registry item(s) to ${outDir}:`);
  for (const file of writtenFiles) {
    console.log(`  + ${file}`);
  }
  if (npmDeps.size > 0) {
    console.log(`\nRequired npm packages: npm install ${Array.from(npmDeps).join(" ")}`);
  }
}

main();
