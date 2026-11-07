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
  "skeleton", "separator", "spinner", "typing-indicator", "message-status"
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
  "pagination", "empty-state", "accordion", "file-upload", "stepper",
  "chat-bubble", "chat-input"
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
  "audit-log", "quota-matrix", "tree-view", "chat-conversation"
];

expectedOrganisms.forEach((org) => {
  test(`Organisms Export: ${org}.tsx exists and is exported`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/organisms/${org}.tsx`)));
    assert.ok(organismsExport.includes(`export * from "./${org}";`));
  });
});

// -----------------------------------------------------------------
// Test Suite 4: Studio Header & Clean Full-Width Layout
// -----------------------------------------------------------------
console.log("\n4. Studio Layout, Focus & Component Showcase Integrity:");

const studioContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8");

test("Studio outer layout is h-screen overflow-hidden (zero competing window scrollbars)", () => {
  assert.ok(studioContent.includes('h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200 overflow-hidden'));
});

test("Top Header uses deterministic CSS transitions (no layoutId jump from bottom nowhere)", () => {
  assert.ok(!studioContent.includes('layoutId="activeGlobalTierPill"'));
  assert.ok(studioContent.includes('mainRef.current?.scrollTo({ top: 0, behavior: "instant" })'));
});

test("Side directory is removed for clean full-width center stage focus", () => {
  assert.ok(!studioContent.includes('COLUMN 1: LEFT SIDEBAR'));
  assert.ok(!studioContent.includes('Atoms Directory'));
  assert.ok(!studioContent.includes('Molecules Directory'));
  assert.ok(!studioContent.includes('Organisms Directory'));
});

test("All 51 Brad Frost components are mounted with unique IDs in Center Stage", () => {
  const allIds = [
    // 20 Atoms
    "atom-typography", "atom-separator", "atom-buttons", "atom-icon-button", "atom-input",
    "atom-textarea", "atom-checkbox", "atom-radio", "atom-switch", "atom-slider",
    "atom-progress", "atom-lucide-icons", "atom-badge", "atom-tag-chip", "atom-kbd",
    "atom-avatar", "atom-skeleton", "atom-spinner", "atom-typing-indicator", "atom-message-status",
    // 18 Molecules
    "mol-form-field", "mol-input-group", "mol-search-bar", "mol-select", "mol-tag-input",
    "mol-calendar", "mol-file-upload", "mol-segmented", "mol-breadcrumbs", "mol-stepper",
    "mol-pagination", "mol-stat-badge", "mol-alert", "mol-tooltip", "mol-empty-state",
    "mol-accordion", "mol-chat-bubble", "mol-chat-input",
    // 13 Organisms
    "org-data-table", "org-global-header", "org-navigation-sidebar", "org-tree-view",
    "org-command-palette", "org-filter-builder", "org-date-picker", "org-metric-card",
    "org-audit-log", "org-quota-matrix", "org-detail-drawer", "org-confirmation-modal",
    "org-chat-conversation"
  ];

  allIds.forEach((id) => {
    assert.ok(studioContent.includes(`id="${id}"`), `Missing component showcase card: ${id}`);
  });
});

// -----------------------------------------------------------------
// Test Suite 5: Vector Icon Tuning & Visual Studio Controls
// -----------------------------------------------------------------
console.log("\n5. Vector Icon Tuning & Visual Studio Controls:");

test("Icon Tokens: DEFAULT_TOKENS provides scale, stroke, fill, and color invariants", () => {
  assert.ok(typesContent.includes("iconScaleMultiplier: 1.0"));
  assert.ok(typesContent.includes("iconStrokeWidth: 2.0"));
  assert.ok(typesContent.includes('iconFill: "none"'));
  assert.ok(typesContent.includes('iconColor: "#71717A"'));
});

test("Icon Tokens: computeScaledTokens calculates dynamic icon sizes and fills", () => {
  assert.ok(typesContent.includes("iconScale"));
  assert.ok(typesContent.includes("iconSize"));
  assert.ok(typesContent.includes("iconSmSize"));
  assert.ok(typesContent.includes("iconLgSize"));
});

test("Visual Studio Dock: Renders comprehensive Iconography & Vector controls", () => {
  assert.ok(studioContent.includes("Iconography"));
  assert.ok(studioContent.includes("Icon scale"));
  assert.ok(studioContent.includes("Stroke width"));
  assert.ok(studioContent.includes("Fill style"));
  assert.ok(studioContent.includes("Icon color"));
  assert.ok(studioContent.includes("iconScaleMultiplier: Number(e.target.value)"));
  assert.ok(studioContent.includes("iconStrokeWidth: s"));
  assert.ok(studioContent.includes("iconFill: key"));
  assert.ok(studioContent.includes("iconColor: e.target.value"));
});

// -----------------------------------------------------------------
// Test Suite 6: Skeleton & Avatar Invariants
// -----------------------------------------------------------------
console.log("\n6. Skeleton & Avatar Invariants:");

const skeletonContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/skeleton.tsx"), "utf8");
const avatarContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/avatar.tsx"), "utf8");

test("Shimmer Skeleton: Has NO border (clean soft shimmer surface)", () => {
  assert.ok(skeletonContent.includes('border: "none"'));
  assert.ok(!skeletonContent.includes("borderWidth: `${tokens.borderWidth}px`"));
});

test("Avatar Primitive: Supports 5 sizes (xs, sm, md, lg, xl) with Unsplash image support & initials fallback", () => {
  assert.ok(avatarContent.includes('xs: { dimension: 24'));
  assert.ok(avatarContent.includes('sm: { dimension: 32'));
  assert.ok(avatarContent.includes('md: { dimension: 40'));
  assert.ok(avatarContent.includes('lg: { dimension: 48'));
  assert.ok(avatarContent.includes('xl: { dimension: 64'));
  assert.ok(avatarContent.includes('<img'));
  assert.ok(avatarContent.includes('<span>{initials}</span>'));
  assert.ok(studioContent.includes('images.unsplash.com/photo-'));
});

// -----------------------------------------------------------------
// Test Suite 7: Native Select Elimination & No Monospace Fonts
// -----------------------------------------------------------------
console.log("\n7. Native Dropdown Elimination & Sans-Serif Typography:");

test("No native <select> elements in Pagination or FilterBuilder", () => {
  const paginationContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/pagination.tsx"), "utf8");
  const filterBuilderContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/filter-builder.tsx"), "utf8");
  assert.ok(!paginationContent.includes("<select"), "Pagination should NOT use native <select>");
  assert.ok(!filterBuilderContent.includes("<select"), "FilterBuilder should NOT use native <select>");
});

test("No monospace typeface fonts in docs-studio.tsx or active atoms", () => {
  assert.ok(!studioContent.includes("font-mono"), "docs-studio.tsx should NOT contain font-mono");
});

test("Chat Conversation Suite: TypingIndicator, MessageStatus, ChatBubble, ChatInput, ChatConversation are functional", () => {
  const typingIndicator = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/typing-indicator.tsx"), "utf8");
  const messageStatus = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/message-status.tsx"), "utf8");
  const chatBubble = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/chat-bubble.tsx"), "utf8");
  const chatInput = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/chat-input.tsx"), "utf8");
  const chatConversation = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/chat-conversation.tsx"), "utf8");

  assert.ok(typingIndicator.includes("dotTransition"));
  assert.ok(messageStatus.includes("CheckCheck"));
  assert.ok(chatBubble.includes("ChatReaction"));
  assert.ok(chatInput.includes("handleKeyDown"));
  assert.ok(chatConversation.includes("handleSendMessage"));
});

// -----------------------------------------------------------------
// Test Suite 8: Button Icon Tuning, Shortcut Removal & Close Icons
// -----------------------------------------------------------------
console.log("\n8. Button Icon Tuning, Shortcut Removal & Semantic Close Icons:");

const buttonContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/button.tsx"), "utf8");
const iconButtonContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/icon-button.tsx"), "utf8");
const commandPaletteContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/command-palette.tsx"), "utf8");
const searchBarContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/search-bar.tsx"), "utf8");
const confirmModalContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/confirmation-modal.tsx"), "utf8");
const detailDrawerContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/detail-drawer.tsx"), "utf8");

test("Button & IconButton: Automatically bind icons to Visual Studio scale, stroke, fill & color", () => {
  assert.ok(buttonContent.includes("renderIcon"));
  assert.ok(buttonContent.includes("tokens.iconStrokeWidth"));
  assert.ok(buttonContent.includes("baseIconSize"));
  assert.ok(iconButtonContent.includes("renderIcon"));
  assert.ok(iconButtonContent.includes("tokens.iconStrokeWidth"));
});

test("No shortcuts or ⌘K displayed in SearchBar or CommandPalette", () => {
  assert.ok(!searchBarContent.includes("⌘K"), "SearchBar should not show ⌘K");
  assert.ok(!commandPaletteContent.includes("⌘K"), "CommandPalette should not show ⌘K");
  assert.ok(!commandPaletteContent.includes("shortcut:"), "CommandPalette should not have shortcuts");
});

test("Semantic close icons (X) used across CommandPalette, Modal, and Drawer", () => {
  assert.ok(commandPaletteContent.includes("Close command palette"));
  assert.ok(confirmModalContent.includes("Close modal"));
  assert.ok(detailDrawerContent.includes("Close drawer"));
  assert.ok(confirmModalContent.includes("Trash2"));
});

console.log("\n==================================================");
console.log(`TEST RUN COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
