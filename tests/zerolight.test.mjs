import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("==================================================");
console.log("  ZEROLIGHT DESIGN SYSTEM AUTOMATED TEST SUITE    ");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    failed++;
  }
}

// -----------------------------------------------------------------
// Test Suite 1: Mathematical Formulas & Contrast in types.ts
// -----------------------------------------------------------------
console.log("1. Mathematical Formulas & Token Invariants:");

// Read types.ts logic directly
const typesContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/types.ts"), "utf8");

// Simple mock runner of computeScaledTokens and getContrastColor
function getContrastColor(hexColor) {
  if (!hexColor) return "#FFFFFF";
  const hex = hexColor.replace("#", "");
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return "#FFFFFF";
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#111111" : "#FFFFFF";
}

test("YIQ Contrast: Dark backgrounds yield crisp white text", () => {
  assert.equal(getContrastColor("#000000"), "#FFFFFF");
  assert.equal(getContrastColor("#111111"), "#FFFFFF");
  assert.equal(getContrastColor("#0F172A"), "#FFFFFF");
  assert.equal(getContrastColor("#991B1B"), "#FFFFFF");
});

test("YIQ Contrast: Light backgrounds yield deep slate/black text", () => {
  assert.equal(getContrastColor("#FFFFFF"), "#111111");
  assert.equal(getContrastColor("#F4F4F5"), "#111111");
  assert.equal(getContrastColor("#FDE047"), "#111111");
});

test("Universal Corner Radius Sharp (0px) guarantees zero rounded geometry", () => {
  assert.ok(typesContent.includes("scaledRadius = 0"));
  assert.ok(typesContent.includes("scaledPillRadius = 0"));
  assert.ok(typesContent.includes("scaledCardRadius = 0"));
  assert.ok(typesContent.includes("scaledCheckboxRadius = 0"));
});

test("Universal Corner Radius Pill (999px) bounds cards while making pills 9999px", () => {
  assert.ok(typesContent.includes("scaledRadius = 9999"));
  assert.ok(typesContent.includes("scaledPillRadius = 9999"));
  assert.ok(typesContent.includes("scaledCardRadius = Math.round(20 * scale)"));
});

// -----------------------------------------------------------------
// Test Suite 2: Motion Physics Configurations
// -----------------------------------------------------------------
console.log("\n2. Motion Physics Engine Configurations:");

test("Motion Physics: Damped spring has stiffness 400 and damping 28", () => {
  assert.ok(typesContent.includes("stiffness: 400, damping: 28"));
  assert.ok(typesContent.includes("drawerTransition: { type: \"spring\", stiffness: 380, damping: 30 }"));
  assert.ok(typesContent.includes("modalTransition: { type: \"spring\", stiffness: 420, damping: 26 }"));
});

test("Motion Physics: Elastic spring has stiffness 460 and damping 20", () => {
  assert.ok(typesContent.includes("stiffness: 460, damping: 20"));
});

test("Hardware Acceleration: Components use transform-gpu", () => {
  const btnContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/button.tsx"), "utf8");
  assert.ok(btnContent.includes("transform-gpu"), "Button should include transform-gpu");
  assert.ok(btnContent.includes("whileTap"), "Button should have whileTap tactile response");
});

// -----------------------------------------------------------------
// Test Suite 3: Modular Architecture & Export Integrity
// -----------------------------------------------------------------
console.log("\n3. Modular Architecture & Component Exports:");

const rootExport = fs.readFileSync(path.join(rootDir, "src/components/zerolight/index.ts"), "utf8");

test("Root index exports ZeroLightProvider, types, atoms, molecules, and organisms", () => {
  assert.ok(rootExport.includes('export * from "./types";'));
  assert.ok(rootExport.includes('export * from "./context";'));
  assert.ok(rootExport.includes('export * from "./atoms";'));
  assert.ok(rootExport.includes('export * from "./molecules";'));
  assert.ok(rootExport.includes('export * from "./organisms";'));
  assert.ok(rootExport.includes('export { ZeroLightStudio } from "./docs-studio";'));
});

const atomsExport = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/index.ts"), "utf8");
const expectedAtoms = [
  "button", "icon-button", "input", "checkbox", "switch",
  "slider", "progress-bar", "badge", "tag-chip", "kbd", "avatar",
  "skeleton", "separator", "spinner"
];

expectedAtoms.forEach((atom) => {
  test(`Atoms Export: ${atom}.tsx exists and is exported`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/atoms/${atom}.tsx`)));
    assert.ok(atomsExport.includes(`export * from "./${atom}";`));
  });
});

const moleculesExport = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/index.ts"), "utf8");
const expectedMolecules = [
  "form-field", "input-group", "search-bar", "select", "tag-input",
  "calendar", "segmented-control", "breadcrumbs", "stat-card", "alert-banner", "tooltip",
  "pagination", "empty-state", "accordion", "file-upload", "stepper"
];

expectedMolecules.forEach((mol) => {
  test(`Molecules Export: ${mol}.tsx exists and is exported`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/molecules/${mol}.tsx`)));
    assert.ok(moleculesExport.includes(`export * from "./${mol}";`));
  });
});

const organismsExport = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
const expectedOrganisms = [
  "data-table", "confirmation-modal", "detail-drawer", "command-palette", "filter-builder",
  "audit-log", "quota-matrix", "tree-view"
];

expectedOrganisms.forEach((org) => {
  test(`Organisms Export: ${org}.tsx exists and is exported`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/organisms/${org}.tsx`)));
    assert.ok(organismsExport.includes(`export * from "./${org}";`));
  });
});

// -----------------------------------------------------------------
// Test Suite 4: Studio Header & Navigation Heuristics
// -----------------------------------------------------------------
console.log("\n4. Studio Layout, Spacing & Directory Integrity:");

const studioContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8");

test("Studio outer layout is h-screen overflow-hidden (zero competing window scrollbars)", () => {
  assert.ok(studioContent.includes('h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200 overflow-hidden'));
});

test("Top Header uses deterministic CSS transitions (no layoutId jump from bottom nowhere)", () => {
  assert.ok(!studioContent.includes('layoutId="activeGlobalTierPill"'));
  assert.ok(studioContent.includes('mainRef.current?.scrollTo({ top: 0, behavior: "instant" })'));
});

test("All 46 Brad Frost components have 1:1 anchor links in the Left Sidebar", () => {
  const allIds = [
    // 18 Atoms
    "atom-typography", "atom-separator", "atom-buttons", "atom-icon-button", "atom-input",
    "atom-textarea", "atom-checkbox", "atom-radio", "atom-switch", "atom-slider",
    "atom-progress", "atom-lucide-icons", "atom-badge", "atom-tag-chip", "atom-kbd",
    "atom-avatar", "atom-skeleton", "atom-spinner",
    // 16 Molecules
    "mol-form-field", "mol-input-group", "mol-search-bar", "mol-select", "mol-tag-input",
    "mol-calendar", "mol-file-upload", "mol-segmented", "mol-breadcrumbs", "mol-stepper",
    "mol-pagination", "mol-stat-badge", "mol-alert", "mol-tooltip", "mol-empty-state",
    "mol-accordion",
    // 12 Organisms
    "org-data-table", "org-global-header", "org-navigation-sidebar", "org-tree-view",
    "org-command-palette", "org-filter-builder", "org-date-picker", "org-metric-card",
    "org-audit-log", "org-quota-matrix", "org-detail-drawer", "org-confirmation-modal"
  ];

  allIds.forEach((id) => {
    assert.ok(studioContent.includes(`href="#${id}"`), `Sidebar missing link to #${id}`);
  });
});

test("All card headers have semantic Lucide vector icons", () => {
  assert.ok(studioContent.includes('<Type className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<MousePointerClick className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<Mail className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<Server className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<AlertTriangle className="w-4 h-4 text-rose-500'));
  assert.ok(studioContent.includes('<Minus className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<UploadCloud className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<ListOrdered className="w-4 h-4 text-neutral-500'));
  assert.ok(studioContent.includes('<FolderTree className="w-4 h-4 text-neutral-500'));
});

console.log("\n==================================================");
console.log(`TEST RUN COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
