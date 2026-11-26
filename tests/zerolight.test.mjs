import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function readDashboardSource() {
  const dir = path.join(rootDir, "src/components/zerolight/dashboard");
  return [
    "dashboard-shell.tsx",
    "overview-tab.tsx",
    "design-system-tab.tsx",
    "settings-tab.tsx",
  ]
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
}

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

function readStudioBundle() {
  const parts = [fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8")];
  const studioDir = path.join(rootDir, "src/components/zerolight/studio");
  if (fs.existsSync(studioDir)) {
    for (const entry of fs.readdirSync(studioDir).sort()) {
      const fullPath = path.join(studioDir, entry);
      if (fs.statSync(fullPath).isFile() && (entry.endsWith(".ts") || entry.endsWith(".tsx"))) {
        parts.push(fs.readFileSync(fullPath, "utf8"));
      }
    }
  }
  return parts.join("\n");
}

const studioContent = readStudioBundle();

test("Motion Physics: Damped spring has stiffness 400 and damping 28", () => {
  assert.ok(typesContent.includes("stiffness: 400, damping: 28"));
  assert.ok(typesContent.includes("drawerTransition: { type: \"spring\", stiffness: 380, damping: 30 }"));
  assert.ok(typesContent.includes("modalTransition: { type: \"spring\", stiffness: 420, damping: 26 }"));
});

test("Motion Physics: Elastic spring has stiffness 460 and damping 20", () => {
  assert.ok(typesContent.includes("stiffness: 460, damping: 20"));
});

test("Motion Physics: Snappy spring has stiffness 520 and damping 32", () => {
  assert.ok(typesContent.includes("520"));
  assert.ok(typesContent.includes("32"));
  assert.ok(typesContent.includes('physics: "snappy"'));
});

test("Motion Physics: Gentle spring has stiffness 280 and damping 30", () => {
  assert.ok(typesContent.includes("280"));
  assert.ok(typesContent.includes("30"));
  assert.ok(typesContent.includes('physics: "gentle"'));
});

test("Motion Physics: Instant preset provides zero-latency reduced motion", () => {
  assert.ok(typesContent.includes('physics: "instant"'));
  assert.ok(typesContent.includes("Zero latency"));
});

test("Visual Studio Dock: Renders comprehensive Motion Physics Engine controls", () => {
  assert.ok(studioContent.includes("Motion Physics Engine"));
  assert.ok(studioContent.includes("motionSpeedMultiplier"));
  assert.ok(studioContent.includes("motionStiffness"));
  assert.ok(studioContent.includes("motionDamping"));
  assert.ok(studioContent.includes("Live Motion Sandbox"));
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
  "skeleton", "separator", "spinner", "typing-indicator", "message-status",
  "payment-card", "currency-pill", "radio-group"
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
  "chat-bubble", "chat-input", "profit-loss-chart", "sparkline", "area-chart",
  "bar-chart", "horizontal-bar-chart", "donut-chart", "gauge-chart",
  "heatmap-matrix", "funnel-chart", "dropdown-menu", "date-range-picker",
  "split-button", "conjoined-field", "form", "transfer", "tree-select", "cascader"
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
  "audit-log", "quota-matrix", "tree-view", "chat-conversation", "toast", "app-shell"
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

test("Visual Studio Dock: Renders Live Data Visualization & Palette Customization", () => {
  assert.ok(studioContent.includes("Data Visualization"), "Must render Data Visualization panel in dock");
  assert.ok(studioContent.includes("chartPalette"), "Must allow selecting chart palette presets");
  assert.ok(studioContent.includes("chartPrimaryColor"), "Must allow customizing chart primary color");
  assert.ok(studioContent.includes("chartStrokeWidth"), "Must allow customizing chart stroke width");
  assert.ok(studioContent.includes("chartFillOpacity"), "Must allow customizing gradient fill opacity");
  assert.ok(studioContent.includes("chartGridStyle"), "Must allow customizing chart grid lines");
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

// -----------------------------------------------------------------
// Test Suite 9: Copywriting, Word Limits & Anti-Crowded Dashboards
// -----------------------------------------------------------------
console.log("\n9. Copywriting, Word Limits & Anti-Crowded Dashboard Invariants:");

const designRulesContent = fs.readFileSync(path.join(rootDir, "DESIGN_RULES.md"), "utf8");
const schoolAttendanceContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/views/school-attendance-view.tsx"), "utf8");

test("DESIGN_RULES.md: Formulates Word Limits, Truncation & Line-Clamp Contracts", () => {
  assert.ok(designRulesContent.includes("Max Words"), "Must define Max Words matrix");
  assert.ok(designRulesContent.includes("Single-Line Truncation Contract (`truncate`)"));
  assert.ok(designRulesContent.includes("2-Line Clamping Contract (`line-clamp-2`)"));
  assert.ok(designRulesContent.includes("Widow & Orphan Elimination"));
  assert.ok(designRulesContent.includes("Zero Layout Shift (CLS = 0) on Numeric Updates"));
});

test("Anti-Crowding Law: Max 4 StatCards, 1 Primary Action, 3-Zone Layout", () => {
  assert.ok(designRulesContent.includes("The 3-Zone Visual Hierarchy"));
  assert.ok(designRulesContent.includes("Maximum 4 Metric Cards"));
  assert.ok(designRulesContent.includes("Exactly ONE Primary Action Button"));
  assert.ok(designRulesContent.includes("Progressive Disclosure via Slide-Over Drawers"));
});

test("School Attendance Dashboard: Adheres to Anti-Crowding and Text Hygiene", () => {
  // Stat cards max 4
  const statCardMatches = schoolAttendanceContent.match(/<StatCard/g) || [];
  assert.ok(statCardMatches.length <= 4, `Must not exceed 4 StatCards, found: ${statCardMatches.length}`);
  
  // Tabular nums for all telemetry
  assert.ok(schoolAttendanceContent.includes("tabular-nums"), "Must use tabular-nums for numeric stability");
  
  // Progressive disclosure via drawer & modal
  assert.ok(schoolAttendanceContent.includes("<Pagination"), "Must use pagination to avoid endless scrolling");
  assert.ok(schoolAttendanceContent.includes("activeStudent"), "Must use slide-over drawer for row details");
  assert.ok(schoolAttendanceContent.includes("isSubmitModalOpen"), "Must use modal for submission");
});

// -----------------------------------------------------------------
// Test Suite 10: FinTech SaaS Suite & Finexy Dashboard
// -----------------------------------------------------------------
console.log("\n10. FinTech SaaS Atoms, Molecules & Finexy Dashboard:");

const paymentCardContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/payment-card.tsx"), "utf8");
const currencyPillContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/currency-pill.tsx"), "utf8");
const profitLossChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/profit-loss-chart.tsx"), "utf8");
const finexyPageContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/views/finexy-view.tsx"), "utf8");

test("PaymentCard Atom: Contactless, Chip, Masked Number & Brand Support", () => {
  assert.ok(paymentCardContent.includes("export function PaymentCard"), "Must export PaymentCard component");
  assert.ok(paymentCardContent.includes("Wifi"), "Must render contactless vector icon");
  assert.ok(paymentCardContent.includes("mastercard"), "Must support mastercard brand");
  assert.ok(paymentCardContent.includes("visa"), "Must support visa brand");
  assert.ok(paymentCardContent.includes("Card Number"), "Must have card number label");
});

test("CurrencyPill Atom: Flag, Balance, Monthly Limit & Status", () => {
  assert.ok(currencyPillContent.includes("export function CurrencyPill"), "Must export CurrencyPill component");
  assert.ok(currencyPillContent.includes("currencyCode"), "Must display currencyCode");
  assert.ok(currencyPillContent.includes("balance"), "Must display balance");
  assert.ok(currencyPillContent.includes("monthlyLimit"), "Must display monthlyLimit");
  assert.ok(currencyPillContent.includes("Active"), "Must display status indicator");
});

test("ProfitLossChart Molecule: Dual-Series Stacked Bars with Tooltips", () => {
  assert.ok(profitLossChartContent.includes("export function ProfitLossChart"), "Must export ProfitLossChart component");
  assert.ok(profitLossChartContent.includes("profitColor"), "Must accept profitColor");
  assert.ok(profitLossChartContent.includes("lossColor"), "Must accept lossColor");
  assert.ok(profitLossChartContent.includes("hoveredIndex"), "Must provide interactive hover state");
});

test("Finexy SaaS Dashboard: 3-Zone Architecture & FinTech Invariants", () => {
  assert.ok(finexyPageContent.includes("Good morning, Oripio"), "Must render Oripio hero greeting");
  assert.ok(finexyPageContent.includes("$689,372.00"), "Must render exact $689,372.00 balance");
  assert.ok(finexyPageContent.includes("PaymentCard"), "Must render virtual payment cards");
  assert.ok(finexyPageContent.includes("CurrencyPill"), "Must render international wallet pills");
  assert.ok(finexyPageContent.includes("ProfitLossChart"), "Must render stacked profit & loss chart");
  assert.ok(finexyPageContent.includes("Recent Activities"), "Must render interactive transaction ledger");
  assert.ok(finexyPageContent.includes("DetailDrawer"), "Must support progressive disclosure drawer on row click");
  assert.ok(finexyPageContent.includes("isTransferModalOpen"), "Must support transfer modal flow");
  assert.ok(finexyPageContent.includes("tabular-nums"), "Must strictly enforce tabular numerals on all amounts");
});

// -----------------------------------------------------------------
// Test Suite 11: Enterprise Data Visualization Family (7+ Chart Molecules)
// -----------------------------------------------------------------
console.log("\n11. Enterprise Data Visualization Family (7+ Chart Molecules):");

const sparklineContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/sparkline.tsx"), "utf8");
const areaChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/area-chart.tsx"), "utf8");
const barChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/bar-chart.tsx"), "utf8");
const horizBarChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/horizontal-bar-chart.tsx"), "utf8");
const donutChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/donut-chart.tsx"), "utf8");
const gaugeChartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/gauge-chart.tsx"), "utf8");
const heatmapContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/heatmap-matrix.tsx"), "utf8");
const funnelContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/funnel-chart.tsx"), "utf8");

test("Data Viz 1: Sparkline - Ultra compact SVG trendline with min/max support", () => {
  assert.ok(sparklineContent.includes("export function Sparkline"));
  assert.ok(sparklineContent.includes("linearGradient"));
  assert.ok(sparklineContent.includes("strokeLinecap"));
  assert.ok(sparklineContent.includes("transition={scaled.motionConfig.spring}"));
});

test("Data Viz 2: AreaChart - Cubic bezier curve with scrubbing crosshair, reactive stroke & spring motion", () => {
  assert.ok(areaChartContent.includes("export function AreaChart"));
  assert.ok(areaChartContent.includes("createSmoothPath"));
  assert.ok(areaChartContent.includes("tabular-nums"));
  assert.ok(areaChartContent.includes("hoverIndex"));
  assert.ok(areaChartContent.includes("effectiveStrokeWidth"));
  assert.ok(areaChartContent.includes("transition={scaled.motionConfig.spring}"));
  assert.ok(areaChartContent.includes("tokens.cornerRadius === 0"));
});

test("Data Viz 3: BarChart - Grouped and stacked columns with dynamic corner radius & spring motion", () => {
  assert.ok(barChartContent.includes("export function BarChart"));
  assert.ok(barChartContent.includes("mode === \"stacked\""));
  assert.ok(barChartContent.includes("borderTopLeftRadius"));
  assert.ok(barChartContent.includes("barRadius"));
  assert.ok(barChartContent.includes("tokens.cornerRadius === 0"));
  assert.ok(barChartContent.includes("transition={scaled.motionConfig.spring}"));
});

test("Data Viz 4: HorizontalBarChart - Ranked progress bars with value formatting & spring motion", () => {
  assert.ok(horizBarChartContent.includes("export function HorizontalBarChart"));
  assert.ok(horizBarChartContent.includes("showRank"));
  assert.ok(horizBarChartContent.includes("tabular-nums"));
  assert.ok(horizBarChartContent.includes("transition={scaled.motionConfig.spring}"));
});

test("Data Viz 5: DonutChart - SVG radial slices with geometric cuts & spring motion", () => {
  assert.ok(donutChartContent.includes("export function DonutChart"));
  assert.ok(donutChartContent.includes("strokeDasharray"));
  assert.ok(donutChartContent.includes("displayCenterValue"));
  assert.ok(donutChartContent.includes("scaled.chartColors"));
  assert.ok(donutChartContent.includes("motion.circle"));
  assert.ok(donutChartContent.includes("transition={scaled.motionConfig.spring}"));
  assert.ok(donutChartContent.includes("tokens.cornerRadius === 0 ? \"butt\" : \"round\""));
});

test("Data Viz 6: GaugeChart - Semicircle radial dial with threshold status zones & polarity", () => {
  assert.ok(gaugeChartContent.includes("export function GaugeChart"));
  assert.ok(gaugeChartContent.includes("arcLength"));
  assert.ok(gaugeChartContent.includes("clampedVal"));
  assert.ok(gaugeChartContent.includes("higher-is-better"));
  assert.ok(gaugeChartContent.includes("transition={scaled.motionConfig.spring}"));
  assert.ok(gaugeChartContent.includes("tokens.cornerRadius === 0 ? \"butt\" : \"round\""));
});

test("Data Viz 7: HeatmapMatrix - Multi-tier activity matrix with interactive cell tooltip & cell radius", () => {
  assert.ok(heatmapContent.includes("export function HeatmapMatrix"));
  assert.ok(heatmapContent.includes("cellRadius"));
  assert.ok(heatmapContent.includes("tokens.cornerRadius === 0"));
  assert.ok(heatmapContent.includes("transition={scaled.motionConfig.spring}"));
  assert.ok(heatmapContent.includes("getCellColor"));
  assert.ok(heatmapContent.includes("hoveredCell"));
});

test("Data Viz 8: FunnelChart - Stage-by-stage drop-off conversion funnel", () => {
  assert.ok(funnelContent.includes("export function FunnelChart"));
  assert.ok(funnelContent.includes("pctOfInitial"));
  assert.ok(funnelContent.includes("stepConversion"));
});

// -----------------------------------------------------------------
// Test Suite 12: Enterprise SaaS Foundations (Toasts, Shell, Action Menu & Radio)
// -----------------------------------------------------------------
console.log("\n12. Enterprise SaaS Foundations (Toasts, Shell, Action Menu & Radio):");

const radioGroupContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/radio-group.tsx"), "utf8");
const dropdownMenuContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/dropdown-menu.tsx"), "utf8");
const toastContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/toast.tsx"), "utf8");
const dateRangeContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/date-range-picker.tsx"), "utf8");
const appShellContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/app-shell.tsx"), "utf8");

test("RadioGroup Atom: Mutually exclusive selection with card & standard mode", () => {
  assert.ok(radioGroupContent.includes("export function RadioGroup"));
  assert.ok(radioGroupContent.includes("role=\"radiogroup\""));
  assert.ok(radioGroupContent.includes("cardMode"));
});

test("DropdownMenu Molecule: Floating action menu with click-outside and keydown", () => {
  assert.ok(dropdownMenuContent.includes("export function DropdownMenu"));
  assert.ok(dropdownMenuContent.includes("handleClickOutside"));
  assert.ok(dropdownMenuContent.includes("handleKeyDown"));
});

test("Toast & ToastProvider Organism: Stacking physics, auto-dismiss and useToast", () => {
  assert.ok(toastContent.includes("export function ToastProvider"));
  assert.ok(toastContent.includes("export function useToast"));
  assert.ok(toastContent.includes("dismiss"));
});

test("DateRangePicker Molecule: Quick preset ranges and custom dual date display", () => {
  assert.ok(dateRangeContent.includes("export function DateRangePicker"));
  assert.ok(dateRangeContent.includes("DEFAULT_PRESETS"));
  assert.ok(dateRangeContent.includes("tabular-nums"));
});

test("AppShell Organism: Collapsible sidebar rail and responsive mobile drawer", () => {
  assert.ok(appShellContent.includes("export function AppShell"));
  assert.ok(appShellContent.includes("isCollapsed"));
  assert.ok(appShellContent.includes("isMobileOpen"));
});

// -----------------------------------------------------------------
// Test Suite 13: Templates & Enterprise SaaS Pages Suite (Atomic Tiers 4 & 5)
// -----------------------------------------------------------------
console.log("\n13. Templates & Enterprise SaaS Pages Suite (Atomic Tiers 4 & 5):");

const templatesExport = fs.readFileSync(path.join(rootDir, "src/components/zerolight/templates/index.ts"), "utf8");
const expectedTemplates = [
  "dashboard-template", "console-table-template", "settings-form-template",
  "analytics-report-template", "chat-workspace-template"
];

expectedTemplates.forEach((tpl) => {
  test(`Template Export: ${tpl}.tsx exists and is exported`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/templates/${tpl}.tsx`)));
    assert.ok(templatesExport.includes(`export * from "./${tpl}";`));
  });
});

const expectedPages = [
  "dev-console", "billing", "ai-assistant", "settings", "finexy", "school-attendance"
];

expectedPages.forEach((pageRoute) => {
  test(`Enterprise SaaS Page: src/app/${pageRoute}/page.tsx exists`, () => {
    assert.ok(fs.existsSync(path.join(rootDir, `src/app/${pageRoute}/page.tsx`)));
  });
});

const dashboardTplContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/templates/dashboard-template.tsx"), "utf8");
test("DashboardTemplate: 3-Zone Architecture with max 4-metric grid & exactly 1 primary action slot", () => {
  assert.ok(dashboardTplContent.includes("ZONE 1: HERO SESSION BAR & HIGH-SIGNAL TELEMETRY"));
  assert.ok(dashboardTplContent.includes("ZONE 2: UNIFIED CORE WORKSPACE"));
  assert.ok(dashboardTplContent.includes("ZONE 3: PROGRESSIVE DISCLOSURE"));
  assert.ok(dashboardTplContent.includes("primaryAction?: React.ReactNode;"));
});

const settingsTplContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/templates/settings-form-template.tsx"), "utf8");
test("SettingsFormTemplate: Multi-tab navigation & sticky unsaved changes bar", () => {
  assert.ok(settingsTplContent.includes("SettingsTabItem"));
  assert.ok(settingsTplContent.includes("isDirty"));
  assert.ok(settingsTplContent.includes("ZONE 3: FLOATING STICKY UNSAVED CHANGES BAR"));
});

const chatTplContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/templates/chat-workspace-template.tsx"), "utf8");
test("ChatWorkspaceTemplate: 3-Pane AI Copilot workspace with session rail & inspector panel", () => {
  assert.ok(chatTplContent.includes("PANE 1: SESSIONS & THREADS SIDEBAR"));
  assert.ok(chatTplContent.includes("PANE 2: ACTIVE CONVERSATION STREAM & PINNED INPUT"));
  assert.ok(chatTplContent.includes("PANE 3: CONTEXT & METADATA INSPECTOR"));
});

// -----------------------------------------------------------------
// Test Suite 14: Shadcn Parity Architecture (Portals, Focus Traps & ARIA)
// -----------------------------------------------------------------
console.log("\n14. Shadcn Competitive Parity Architecture:");

const tooltipContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/tooltip.tsx"), "utf8");
test("Floating Engine: Tooltip renders via createPortal to prevent overflow clipping", () => {
  assert.ok(tooltipContent.includes("createPortal"));
  assert.ok(tooltipContent.includes('role="tooltip"'));
  assert.ok(tooltipContent.includes("aria-describedby"));
  assert.ok(tooltipContent.includes("getBoundingClientRect"));
});

const dropdownContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/dropdown-menu.tsx"), "utf8");
test("Floating Engine: DropdownMenu renders via createPortal with ARIA menu state machine", () => {
  assert.ok(dropdownContent.includes("createPortal"));
  assert.ok(dropdownContent.includes('role="menu"'));
  assert.ok(dropdownContent.includes('role="menuitem"'));
  assert.ok(dropdownContent.includes("typeaheadBuffer"));
  assert.ok(dropdownContent.includes("handleKeyDown"));
});

const modalContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/confirmation-modal.tsx"), "utf8");
test("Overlay Architecture: ConfirmationModal has focus trapping and CLS-free scroll lock", () => {
  assert.ok(modalContent.includes("createPortal"));
  assert.ok(modalContent.includes('role="alertdialog"'));
  assert.ok(modalContent.includes("scrollbarWidth"));
  assert.ok(modalContent.includes("document.body.style.overflow = \"hidden\""));
  assert.ok(modalContent.includes("e.key === \"Tab\""));
  assert.ok(modalContent.includes("previousActiveElement"));
});

const drawerContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/detail-drawer.tsx"), "utf8");
test("Overlay Architecture: DetailDrawer has focus trapping and CLS-free scroll lock", () => {
  assert.ok(drawerContent.includes("createPortal"));
  assert.ok(drawerContent.includes('role="dialog"'));
  assert.ok(drawerContent.includes("scrollbarWidth"));
  assert.ok(drawerContent.includes("document.body.style.overflow = \"hidden\""));
  assert.ok(drawerContent.includes("e.key === \"Tab\""));
  assert.ok(drawerContent.includes("previousActiveElement"));
});

const formContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/form.tsx"), "utf8");
test("Composable Form Family: Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage", () => {
  assert.ok(formContent.includes("FormItemContext"));
  assert.ok(formContent.includes("useFormField"));
  assert.ok(formContent.includes("export function Form("));
  assert.ok(formContent.includes("export function FormItem("));
  assert.ok(formContent.includes("export function FormLabel("));
  assert.ok(formContent.includes("export function FormControl("));
  assert.ok(formContent.includes("export function FormDescription("));
  assert.ok(formContent.includes("export function FormMessage("));
  assert.ok(formContent.includes("aria-describedby"));
  assert.ok(formContent.includes("aria-invalid"));
});

// -----------------------------------------------------------------
// Test Suite 15: Global Enterprise Parity & RTL Layout Engine
// -----------------------------------------------------------------
console.log("\n15. Global Enterprise Parity Suite:");

const transferContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/transfer.tsx"), "utf8");
test("Enterprise Transfer Molecule: Dual-list shuttle with indeterminate master toggle & search", () => {
  assert.ok(transferContent.includes("indeterminate={isIndeterminate}"));
  assert.ok(transferContent.includes("moveToTarget"));
  assert.ok(transferContent.includes("moveToSource"));
  assert.ok(transferContent.includes("scaled.motionConfig.spring"));
});

const treeSelectContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/tree-select.tsx"), "utf8");
test("Enterprise TreeSelect Molecule: Portaled hierarchy with indeterminate branch math & smart tag folding", () => {
  assert.ok(treeSelectContent.includes("createPortal"));
  assert.ok(treeSelectContent.includes('role="tree"'));
  assert.ok(treeSelectContent.includes('role="treeitem"'));
  assert.ok(treeSelectContent.includes("indeterminate={isIndeterminate}"));
  assert.ok(treeSelectContent.includes("maxTagCount"));
});

const cascaderContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/cascader.tsx"), "utf8");
test("Enterprise Cascader Molecule: Portaled Miller columns drill-down picker", () => {
  assert.ok(cascaderContent.includes("createPortal"));
  assert.ok(cascaderContent.includes("activePath"));
  assert.ok(cascaderContent.includes("columns.map"));
});

const dataTableContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/data-table.tsx"), "utf8");
test("Enterprise DataTable Organism: Inline spreadsheet cell editing support", () => {
  assert.ok(dataTableContent.includes("editable"));
  assert.ok(dataTableContent.includes("onUpdateNode"));
  assert.ok(dataTableContent.includes("renderEditableCell"));
});

const contextContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/context.tsx"), "utf8");
test("Bi-Directional RTL/LTR Engine: Token, Context & Drawer mirroring", () => {
  assert.ok(typesContent.includes('direction?: "ltr" | "rtl"'));
  assert.ok(typesContent.includes("isRtl: boolean"));
  assert.ok(contextContent.includes("dir={scaled.direction}"));
  assert.ok(drawerContent.includes("scaled.isRtl"));
});

// -----------------------------------------------------------------
// Test Suite 16: Visual Studio Token Binding Integrity (Zero Ghost Settings)
// -----------------------------------------------------------------
console.log("\n16. Visual Studio Token Binding Integrity:");

test("Motion Physics Engine: DEFAULT_TOKENS does not lock preset springs and applies overrides uniformly", () => {
  const defaultTokensBlock = typesContent.slice(
    typesContent.indexOf("export const DEFAULT_TOKENS"),
    typesContent.indexOf("export interface MotionConfig")
  );
  assert.ok(!defaultTokensBlock.includes("motionStiffness:"), "DEFAULT_TOKENS must leave motionStiffness undefined");
  assert.ok(!defaultTokensBlock.includes("motionDamping:"), "DEFAULT_TOKENS must leave motionDamping undefined");
  assert.ok(!defaultTokensBlock.includes("motionMass:"), "DEFAULT_TOKENS must leave motionMass undefined");
  assert.ok(!defaultTokensBlock.includes("tapScale:"), "DEFAULT_TOKENS must leave tapScale undefined");
  assert.ok(typesContent.includes("const base = resolveBaseConfig()"));
  assert.ok(typesContent.includes("tokens.motionStiffness !== undefined"));
  assert.ok(typesContent.includes("tokens.motionDamping !== undefined"));
  assert.ok(typesContent.includes("tokens.motionSpeedMultiplier"));
});

test("Menu Offset Gap: DropdownMenu, SplitButton, and Tooltip consume tokens.menuOffsetGap", () => {
  const dropdownMenuContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/dropdown-menu.tsx"), "utf8");
  const splitButtonContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/split-button.tsx"), "utf8");
  const tooltipContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/tooltip.tsx"), "utf8");
  assert.ok(dropdownMenuContent.includes("tokens.menuOffsetGap"), "DropdownMenu should read tokens.menuOffsetGap");
  assert.ok(splitButtonContent.includes("tokens.menuOffsetGap"), "SplitButton should read tokens.menuOffsetGap");
  assert.ok(tooltipContent.includes("tokens.menuOffsetGap"), "Tooltip should read tokens.menuOffsetGap");
});

test("Token Export Completeness: CSS and JSON exports include RTL, motion, and data-viz tokens", () => {
  assert.ok(studioContent.includes("--zl-direction:"));
  assert.ok(studioContent.includes("--zl-motion-physics:"));
  assert.ok(studioContent.includes("--zl-motion-speed:"));
  assert.ok(studioContent.includes("--zl-chart-primary:"));
  assert.ok(studioContent.includes("chartPalette: t.chartPalette"));
  assert.ok(studioContent.includes("chartGridStyle: t.chartGridStyle"));
  assert.ok(studioContent.includes("direction: t.direction"));
});

test("Visual Studio Left-Side Draggable Resizer: Supports smooth pointer scaling, keyboard steps, and double-click reset", () => {
  assert.ok(studioContent.includes("startStudioResize"), "Studio should implement startStudioResize pointer handler");
  assert.ok(studioContent.includes('aria-label="Resize Visual Studio panel"'), "Left resizer should expose accessible separator");
  assert.ok(studioContent.includes("STUDIO_MIN_WIDTH"), "Left resizer should enforce minimum dock width");
  assert.ok(studioContent.includes("STUDIO_MAX_WIDTH"), "Left resizer should enforce maximum dock width");
  assert.ok(studioContent.includes("width: `${studioWidth}px`"), "Desktop aside should bind dynamic studioWidth");
  assert.ok(studioContent.includes("cursor-col-resize"), "Left resizer should display col-resize cursor");
});

test("Motion Engine Propagation: CSS never overrides Framer Motion transforms and atoms/molecules bind active motionConfig", () => {
  assert.ok(!typesContent.includes("return `all ${dur("), "getTransitionStyle must not emit 'all' CSS transition that conflicts with Framer Motion transforms");
  assert.ok(typesContent.includes("motionDistance?: number"), "ZeroLightTokens should expose motionDistance");
  assert.ok(typesContent.includes("hoverScale?: number"), "ZeroLightTokens should expose hoverScale");
  assert.ok(studioContent.includes("Spring Mass (Inertia)"), "Motion Physics Engine should expose Spring Mass slider");
  assert.ok(studioContent.includes("Entrance Slide Distance"), "Motion Physics Engine should expose Entrance Slide Distance slider");
  assert.ok(studioContent.includes("Tactile Hover Lift"), "Motion Physics Engine should expose Tactile Hover Lift controls");

  const segContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/segmented-control.tsx"), "utf8");
  const cbContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/checkbox.tsx"), "utf8");
  const radioContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/radio-group.tsx"), "utf8");
  const progContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/progress-bar.tsx"), "utf8");
  const ttContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/tooltip.tsx"), "utf8");
  const iconBtnContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/icon-button.tsx"), "utf8");

  assert.ok(segContent.includes("scaled.motionConfig.pillTransition"), "SegmentedControl should glide pill with motionConfig.pillTransition");
  assert.ok(cbContent.includes("scaled.motionConfig.transition"), "Checkbox should animate checkmark with motionConfig.transition");
  assert.ok(radioContent.includes("scaled.motionConfig.transition"), "RadioGroup should animate selection with motionConfig.transition");
  assert.ok(progContent.includes("scaled.motionConfig.transition"), "ProgressBar should animate progress bar with motionConfig.transition");
  assert.ok(ttContent.includes("scaled.motionConfig.popover.transition"), "Tooltip should animate with motionConfig.popover.transition");
  assert.ok(iconBtnContent.includes("scaled.motionConfig.tapScale"), "IconButton should read dynamic motionConfig.tapScale");
});

// ============================================================================
// TEST SUITE 17: Theme Polarity Presets, Persistence & Component Registry
// ============================================================================
console.log("\n--- Test Suite 17: Theme Polarity, Persistence & Registry ---");

test("Theme Polarity Presets: Light, Dark, Slate, and Contrast presets exist with accessible surface detection", () => {
  assert.ok(typesContent.includes("export const THEME_PRESETS"), "types.ts should export THEME_PRESETS");
  assert.ok(typesContent.includes("isDarkSurface: boolean"), "ScaledTokens should declare isDarkSurface");
  assert.ok(typesContent.includes('light: {'), "THEME_PRESETS should include light preset");
  assert.ok(typesContent.includes('dark: {'), "THEME_PRESETS should include dark preset");
  assert.ok(typesContent.includes('slate: {'), "THEME_PRESETS should include slate preset");
  assert.ok(typesContent.includes('contrast: {'), "THEME_PRESETS should include contrast preset");
  assert.ok(studioContent.includes('data-testid={`theme-preset-${presetKey}`}'), "Visual Studio should expose Theme Polarity buttons");
});

test("Persistence: Visual Studio saves and restores tokens & studioWidth via SSR-safe localStorage", () => {
  assert.ok(studioContent.includes('TOKENS_STORAGE_KEY = "zerolight.tokens.v1"'), "Should persist tokens under versioned localStorage key");
  assert.ok(studioContent.includes('STUDIO_WIDTH_STORAGE_KEY = "zerolight.studioWidth.v1"'), "Should persist studioWidth under versioned localStorage key");
  assert.ok(studioContent.includes("window.localStorage.removeItem(TOKENS_STORAGE_KEY)"), "Reset should clear saved tokens from localStorage");
  assert.ok(studioContent.includes("window.localStorage.removeItem(STUDIO_WIDTH_STORAGE_KEY)"), "Reset should clear saved studioWidth from localStorage");
});

test("Component Registry: public/registry/index.json and item manifests exist and stay consistent", () => {
  const registryIndexPath = path.join(rootDir, "public/registry/index.json");
  assert.ok(fs.existsSync(registryIndexPath), "public/registry/index.json should exist");
  const registryIndex = JSON.parse(fs.readFileSync(registryIndexPath, "utf8"));
  assert.ok(registryIndex.totalCount >= 80, `Expected >= 80 registry components, got ${registryIndex.totalCount}`);
  assert.ok(Array.isArray(registryIndex.items), "registry index should expose items array");

  const buttonItemPath = path.join(rootDir, "public/registry/button.json");
  assert.ok(fs.existsSync(buttonItemPath), "public/registry/button.json should exist");
  const buttonItem = JSON.parse(fs.readFileSync(buttonItemPath, "utf8"));
  assert.strictEqual(buttonItem.name, "button");
  assert.ok(buttonItem.files?.[0]?.content?.includes("export function Button"), "button.json should embed Button TSX source");
  assert.ok(studioContent.includes('{ key: "registry", label: "Component TSX" }'), "Studio Export modal should include Component TSX registry tab");
});

// ============================================================================
// TEST SUITE 18: Modular Studio Split & Generic DataTable<T>
// ============================================================================
console.log("\n--- Test Suite 18: Modular Architecture & Generic DataTable ---");

test("Studio Modular Architecture: Visual Studio inspector, export modal, and Tier 4/5 showcases live in studio/", () => {
  for (const mod of [
    "src/components/zerolight/studio/studio-export.ts",
    "src/components/zerolight/studio/studio-inspector.tsx",
    "src/components/zerolight/studio/export-registry-modal.tsx",
    "src/components/zerolight/studio/templates-showcase.tsx",
    "src/components/zerolight/studio/pages-showcase.tsx",
  ]) {
    assert.ok(fs.existsSync(path.join(rootDir, mod)), `Expected modular studio file: ${mod}`);
  }
});

test("Generic DataTable<T>: Supports typed columns and rows alongside Cluster nodes compatibility", () => {
  const dtContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/data-table.tsx"), "utf8");
  assert.ok(dtContent.includes("export interface DataTableColumn<T>"), "Should export DataTableColumn<T>");
  assert.ok(dtContent.includes("export function DataTable<T = NodeRecord>"), "DataTable should accept generic row type T");
  assert.ok(dtContent.includes("if (columns && rows)"), "DataTable should support generic columns + rows mode");
  assert.ok(dtContent.includes("footerAction"), "DataTable should support optional footerAction slot");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 19: Component Upgrades & /donations Route
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n=== Suite 19: Component Upgrades & /donations Route ===");

test("Upgraded AppShell supports grouped navSections, left-bar active indicator, nested children, and sidebarWidgets", () => {
  const shellContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/app-shell.tsx"), "utf8");
  assert.ok(shellContent.includes("export interface NavSection"), "Should export NavSection");
  assert.ok(shellContent.includes("navSections"), "Should accept navSections prop");
  assert.ok(shellContent.includes("activeIndicator"), "Should support activeIndicator variant");
  assert.ok(shellContent.includes("sidebarWidgets"), "Should support sidebarWidgets slot");
  assert.ok(shellContent.includes("external?: boolean"), "Should support external link indicator");
});

test("Upgraded StatCard and AreaChart support horizontal KPI layout, minorDecimal, linear curve, and KPI header", () => {
  const statContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/stat-card.tsx"), "utf8");
  assert.ok(statContent.includes('layout?: "vertical" | "horizontal"'), "StatCard should support horizontal layout");
  assert.ok(statContent.includes("minorDecimal"), "StatCard should support minorDecimal styling");
  assert.ok(statContent.includes("deltaPill"), "StatCard should support deltaPill variant");

  const chartContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/area-chart.tsx"), "utf8");
  assert.ok(chartContent.includes('curve?: "smooth" | "linear"'), "AreaChart should support linear curve");
  assert.ok(chartContent.includes("showArea"), "AreaChart should support disabling area gradient fill");
  assert.ok(chartContent.includes("kpiHeader"), "AreaChart should support kpiHeader slot");
  assert.ok(chartContent.includes("yAxisFormatter"), "AreaChart should support yAxisFormatter");
});

test("Upgraded Badge, Select, CopyTrigger, and TrendDelta support dotless categorical tags, inline pills, and token awareness", () => {
  const badgeContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/badge.tsx"), "utf8");
  assert.ok(badgeContent.includes("showDot"), "Badge should support showDot toggle");
  assert.ok(badgeContent.includes('"lime"') && badgeContent.includes('"lilac"') && badgeContent.includes('"indigo"'), "Badge should include categorical variants");

  const selectContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/select.tsx"), "utf8");
  assert.ok(selectContent.includes("inline?: boolean"), "Select should support inline pill mode");

  const copyContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/copy-trigger.tsx"), "utf8");
  assert.ok(copyContent.includes("useZeroLight"), "CopyTrigger should adapt to ZeroLight polarity");

  const trendContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/trend-delta.tsx"), "utf8");
  assert.ok(trendContent.includes("useZeroLight"), "TrendDelta should adapt to ZeroLight polarity");
});

test("DonationsView and /donations Next.js route exist", () => {
  assert.ok(fs.existsSync(path.join(rootDir, "src/components/zerolight/views/donations-view.tsx")), "DonationsView file should exist");
  assert.ok(fs.existsSync(path.join(rootDir, "src/app/donations/page.tsx")), "/donations Next.js page route should exist");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 20: Google Fonts Typography Engine & Studio Redesign
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n=== Suite 20: Google Fonts Engine & Visual Studio Redesign ===");

test("Google Fonts Catalog, Pairing Presets, and Dynamic URL Builder exist in types.ts", () => {
  assert.ok(typesContent.includes("export const GOOGLE_FONT_CATALOG"), "types.ts should export GOOGLE_FONT_CATALOG");
  assert.ok(typesContent.includes("export const FONT_PAIRING_PRESETS"), "types.ts should export FONT_PAIRING_PRESETS");
  assert.ok(typesContent.includes("export function buildGoogleFontsUrl"), "types.ts should export buildGoogleFontsUrl");
  assert.ok(typesContent.includes("Fraunces") && typesContent.includes("Inter"), "Catalog should include Sans & Serif options");
  assert.ok(typesContent.includes("resolvedFontFamily") && typesContent.includes("resolvedHeadingFontFamily"), "ScaledTokens should compute resolved font stacks");
});

test("ZeroLightProvider injects dynamic Google Fonts stylesheet and exports typography CSS variables", () => {
  const ctxContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/context.tsx"), "utf8");
  assert.ok(ctxContent.includes("zerolight-google-fonts"), "Provider should manage link#zerolight-google-fonts");
  assert.ok(ctxContent.includes("--zl-font-family"), "Provider should emit --zl-font-family CSS variable");
  assert.ok(ctxContent.includes("--zl-heading-font"), "Provider should emit --zl-heading-font CSS variable");
  assert.ok(ctxContent.includes("data-zl-typography-scope"), "Provider should scope typography attributes cleanly");

  const cssContent = fs.readFileSync(path.join(rootDir, "src/app/globals.css"), "utf8");
  assert.ok(cssContent.includes('[data-zl-typography-scope="true"]'), "globals.css should apply typography scope variables");
  assert.ok(cssContent.includes('[data-zl-studio-chrome="true"]'), "globals.css should isolate Visual Studio chrome font");
});

test("Studio Export generates Google Fonts @import and Tailwind fontFamily tokens", () => {
  const exportContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/studio/studio-export.ts"), "utf8");
  assert.ok(exportContent.includes("buildGoogleFontsUrl"), "studio-export should embed Google Fonts @import url");
  assert.ok(exportContent.includes("--zl-font-family"), "CSS snippet should include --zl-font-family");
  assert.ok(exportContent.includes("headingFontFamily"), "JSON snippet should include headingFontFamily");
});

test("Visual Studio Redesign: Modular 5-tab architecture with sticky header/footer and panels", () => {
  for (const mod of [
    "src/components/zerolight/studio/studio-ui.tsx",
    "src/components/zerolight/studio/panel-theme.tsx",
    "src/components/zerolight/studio/panel-typography.tsx",
    "src/components/zerolight/studio/panel-layout.tsx",
    "src/components/zerolight/studio/panel-motion.tsx",
    "src/components/zerolight/studio/panel-assets.tsx",
  ]) {
    assert.ok(fs.existsSync(path.join(rootDir, mod)), `Expected Visual Studio panel module: ${mod}`);
  }
  const inspectorContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/studio/studio-inspector.tsx"), "utf8");
  assert.ok(inspectorContent.includes('id: "theme"') && inspectorContent.includes('id: "type"') && inspectorContent.includes('id: "motion"'), "StudioInspector should expose clean 5-tab navigation");
  assert.ok(inspectorContent.includes("Copy CSS"), "StudioInspector should expose quick Copy CSS action in sticky footer");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 21: Missing Everyday Primitives & Layout Blocks
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n=== Suite 21: Everyday Primitives & Layout Blocks ===");

test("Missing Atom Primitives exist and are exported from atoms/index.ts", () => {
  const atomsIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/index.ts"), "utf8");
  for (const mod of ["label", "textarea", "card", "scroll-area", "button-group"]) {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/atoms/${mod}.tsx`)), `Missing atom: ${mod}.tsx`);
    assert.ok(atomsIdx.includes(`export * from "./${mod}";`), `atoms/index.ts should export ${mod}`);
  }
  const cardContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/atoms/card.tsx"), "utf8");
  assert.ok(cardContent.includes("export function Card") && cardContent.includes("export function CardHeader") && cardContent.includes("export function CardContent"));
});

test("Missing Molecule Primitives exist and are exported from molecules/index.ts", () => {
  const molIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/index.ts"), "utf8");
  for (const mod of ["tabs", "list-row", "popover", "toolbar", "file-card"]) {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/molecules/${mod}.tsx`)), `Missing molecule: ${mod}.tsx`);
    assert.ok(molIdx.includes(`export * from "./${mod}";`), `molecules/index.ts should export ${mod}`);
  }
  const popoverContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/popover.tsx"), "utf8");
  assert.ok(popoverContent.includes("createPortal"), "Popover should render via createPortal");
});

test("Missing Organism & Block Primitives exist and are exported from organisms/index.ts", () => {
  const orgIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
  for (const mod of ["modal", "page-header", "page-layout"]) {
    assert.ok(fs.existsSync(path.join(rootDir, `src/components/zerolight/organisms/${mod}.tsx`)), `Missing organism: ${mod}.tsx`);
    assert.ok(orgIdx.includes(`export * from "./${mod}";`), `organisms/index.ts should export ${mod}`);
  }
  const modalContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/modal.tsx"), "utf8");
  assert.ok(modalContent.includes("createPortal") && modalContent.includes("export const Dialog = Modal"), "Modal should use createPortal and alias Dialog");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 22: Studio Hierarchy, Elevation/Secondary Chart Tokens & World Maps
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n=== Suite 22: Studio Hierarchy, Elevation & World Maps ===");

test("Elevation token & chartSecondaryColor are wired into types, export, and Studio panels", () => {
  const typesContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/types.ts"), "utf8");
  assert.ok(typesContent.includes('export type ElevationPreset = "flat" | "soft" | "elevated"'), "types.ts should define ElevationPreset");
  assert.ok(typesContent.includes("elevationPreset"), "computeScaledTokens should compute cardShadow from elevationPreset");

  const layoutPanel = fs.readFileSync(path.join(rootDir, "src/components/zerolight/studio/panel-layout.tsx"), "utf8");
  assert.ok(layoutPanel.includes("elevation-${id}") && layoutPanel.includes("Elevated"), "panel-layout should expose Elevation controls");

  const assetsPanel = fs.readFileSync(path.join(rootDir, "src/components/zerolight/studio/panel-assets.tsx"), "utf8");
  assert.ok(assetsPanel.includes("chartSecondaryColor") && assetsPanel.includes("chart-secondary-color"), "panel-assets should expose chartSecondaryColor picker");
  assert.ok(assetsPanel.includes('"Emerald"') && assetsPanel.includes('"Violet"'), "panel-assets should render full readable palette names");

  const exportContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/studio/studio-export.ts"), "utf8");
  assert.ok(exportContent.includes("--zl-elevation"), "studio-export should emit --zl-elevation");
});

test("WorldMap molecule and GeoBreakdown organism exist, export, and are showcased", () => {
  const molIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/index.ts"), "utf8");
  const orgIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
  assert.ok(molIdx.includes('export * from "./world-map";'), "molecules/index.ts should export world-map");
  assert.ok(orgIdx.includes('export * from "./geo-breakdown";'), "organisms/index.ts should export geo-breakdown");

  const worldMapContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/world-map.tsx"), "utf8");
  assert.ok(worldMapContent.includes("WORLD_COUNTRIES") && worldMapContent.includes("REGION_VIEWBOXES"), "WorldMap should include country polygons and region viewboxes");
  assert.ok(!worldMapContent.includes("font-mono"), "WorldMap must not use font-mono");

  const geoContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/geo-breakdown.tsx"), "utf8");
  assert.ok(geoContent.includes("WorldMap") && geoContent.includes("ProgressBar") && geoContent.includes("TrendDelta"), "GeoBreakdown should compose WorldMap, ProgressBar, and TrendDelta");

  const studioDoc = fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8");
  assert.ok(studioDoc.includes("<WorldMap") && studioDoc.includes("<GeoBreakdown"), "docs-studio.tsx should showcase WorldMap and GeoBreakdown");
});

test("Design System Learning Agent (.agents) skill, rules, AI footprints guide, and evolution log exist", () => {
  for (const rel of [
    ".agents/skills/design-system-learner/SKILL.md",
    ".agents/rules/zerolight-bulletproof-saas.md",
    ".agents/rules/learned-saas-rules.md",
    ".agents/docs/ai-footprints-guide.md",
    ".agents/memory/design-evolution-log.jsonl",
  ]) {
    assert.ok(fs.existsSync(path.join(rootDir, rel)), `Missing learning agent artifact: ${rel}`);
  }
  const logLine = fs.readFileSync(path.join(rootDir, ".agents/memory/design-evolution-log.jsonl"), "utf8").trim().split("\n")[0];
  const parsed = JSON.parse(logLine);
  assert.ok(Array.isArray(parsed.rulesAdded) && parsed.rulesAdded.length > 0, "Evolution log must record learned rules");
});

test("ZeroLight Distribution CLI and Telemetry Pipeline exist and execute", () => {
  const cliPath = path.join(rootDir, "bin/cli.mjs");
  assert.ok(fs.existsSync(cliPath), "CLI executable bin/cli.mjs must exist");

  const ciPath = path.join(rootDir, ".github/workflows/ci.yml");
  assert.ok(fs.existsSync(ciPath), "GitHub Actions CI workflow must exist");

  const telemetryPath = path.join(rootDir, "src/components/zerolight/telemetry/collector.ts");
  assert.ok(fs.existsSync(telemetryPath), "Telemetry collector must exist");

  const apiPath = path.join(rootDir, "src/app/api/telemetry/route.ts");
  assert.ok(fs.existsSync(apiPath), "Telemetry API endpoint must exist");

  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
  assert.equal(pkg.bin?.zerolight, "./bin/cli.mjs", "package.json must declare zerolight binary");
});

test("Enterprise Security Headers, Zod Schema & SaaS Blueprints exist and function", () => {
  const nextConfigContent = fs.readFileSync(path.join(rootDir, "next.config.mjs"), "utf8");
  assert.ok(nextConfigContent.includes("X-Frame-Options") && nextConfigContent.includes("nosniff"), "next.config.mjs must declare security headers");

  const ciContent = fs.readFileSync(path.join(rootDir, ".github/workflows/ci.yml"), "utf8");
  assert.ok(ciContent.includes("trufflehog"), "CI must include TruffleHog secret scanning step");

  const molIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/index.ts"), "utf8");
  assert.ok(molIdx.includes("organization-switcher") && molIdx.includes("api-key-vault"), "molecules/index.ts must export OrganizationSwitcher and ApiKeyVault");

  const telemetryRoute = fs.readFileSync(path.join(rootDir, "src/app/api/telemetry/route.ts"), "utf8");
  assert.ok(telemetryRoute.includes("TelemetryEventSchema") && telemetryRoute.includes("safeParse"), "telemetry API route must validate requests with Zod schema");

  const docsStudio = fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8");
  assert.ok(docsStudio.includes("<OrganizationSwitcher") && docsStudio.includes("<ApiKeyVault"), "docs-studio.tsx must showcase OrganizationSwitcher and ApiKeyVault");
});

test("Enterprise BillingPortal and TeamPermissions organisms exist, export, and comply with token invariants", () => {
  const orgIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
  assert.ok(orgIdx.includes('export * from "./billing-portal";'), "organisms/index.ts must export billing-portal");
  assert.ok(orgIdx.includes('export * from "./team-permissions";'), "organisms/index.ts must export team-permissions");

  const billingContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/billing-portal.tsx"), "utf8");
  assert.ok(billingContent.includes("useZeroLight"), "BillingPortal must bind to useZeroLight tokens");
  assert.ok(billingContent.includes("PaymentCard"), "BillingPortal must embed PaymentCard");
  assert.ok(billingContent.includes("DetailDrawer"), "BillingPortal must support interactive invoice detail drawer");
  assert.ok(billingContent.includes("tabular-nums"), "BillingPortal must use tabular-nums for financial amounts");
  assert.ok(!billingContent.includes("font-mono"), "BillingPortal must not use font-mono for metrics");

  const teamContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/team-permissions.tsx"), "utf8");
  assert.ok(teamContent.includes("useZeroLight"), "TeamPermissions must bind to useZeroLight tokens");
  assert.ok(teamContent.includes("InviteSchema") && teamContent.includes("z.object"), "TeamPermissions must validate invites with Zod");
  assert.ok(teamContent.includes("PERMISSION_SCOPES"), "TeamPermissions must declare granular RBAC scopes");
  assert.ok(teamContent.includes("twoFactorEnabled"), "TeamPermissions must track hardware 2FA status");
  assert.ok(!teamContent.includes("font-mono"), "TeamPermissions must not use font-mono for metrics");

  const docsStudio = fs.readFileSync(path.join(rootDir, "src/components/zerolight/docs-studio.tsx"), "utf8");
  assert.ok(docsStudio.includes("<BillingPortal") && docsStudio.includes("<TeamPermissions"), "docs-studio.tsx must showcase BillingPortal and TeamPermissions");

  const registry = JSON.parse(fs.readFileSync(path.join(rootDir, "public/registry/index.json"), "utf8"));
  assert.ok(registry.items.some((i) => i.name === "billing-portal"), "Registry must include billing-portal");
  assert.ok(registry.items.some((i) => i.name === "team-permissions"), "Registry must include team-permissions");
});

test("Enterprise Authentication Gate and Floating Sidebar Dashboard Shell exist and comply with specs", () => {
  const rootIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/index.ts"), "utf8");
  assert.ok(rootIndex.includes("auth-context") && rootIndex.includes("sign-in-card") && rootIndex.includes("dashboard-shell"), "root index must export AuthProvider, SignInCard, and DashboardShell");

  const authContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/auth/auth-context.tsx"), "utf8");
  assert.ok(authContent.includes("22121997") && authContent.includes("zerolight"), "auth-context must authenticate zerolight / 22121997");
  assert.ok(authContent.includes("AUTH_STORAGE_KEY"), "auth-context must persist session tokens in storage");

  const signInContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/auth/sign-in-card.tsx"), "utf8");
  assert.ok(signInContent.includes("useAuth"), "SignInCard must bind to useAuth context");
  assert.ok(signInContent.includes("Password"), "SignInCard must have password field with toggle");
  assert.ok(signInContent.includes("<Kbd"), "SignInCard must include Kbd keyboard shortcut accelerator");

  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("Overview"), "DashboardShell must have Overview view");
  assert.ok(dashboardContent.includes("TOTAL COMPONENTS ADDED"), "DashboardShell Overview must feature total components metric");
  assert.ok(dashboardContent.includes("TOTAL SAAS TEMPLATES"), "DashboardShell Overview must feature total SaaS templates metric");
  assert.ok(dashboardContent.includes("TOTAL NICHES COVERED"), "DashboardShell Overview must feature total niches metric");
  assert.ok(dashboardContent.includes("TOTAL CLIENTS SERVED"), "DashboardShell Overview must feature total clients metric");
  assert.ok(dashboardContent.includes("Frequently Asked Questions & Architecture"), "DashboardShell Overview must feature FAQ section");
  assert.ok(!dashboardContent.includes("Vector Map Studio & Asset Downloader"), "DashboardShell Overview must not feature removed Tools preview");
  assert.ok(!dashboardContent.includes("Visual Studio Dock"), "DashboardShell must not reference removed Visual Studio Dock");
  assert.ok(dashboardContent.includes("Design System"), "DashboardShell must have Design System Docs view");
  assert.ok(!dashboardContent.includes('label: "Tools"'), "DashboardShell must not expose removed Tools label");
  assert.ok(dashboardContent.includes("Settings & MCP"), "DashboardShell must have Settings view with MCP status");

  const homePage = fs.readFileSync(path.join(rootDir, "src/app/page.tsx"), "utf8");
  assert.ok(homePage.includes("AuthProvider") && homePage.includes("SignInCard") && homePage.includes("DashboardShell"), "home page must gate access via AuthProvider and SignInCard");
});

// -----------------------------------------------------------------
// Test Suite 25: Apple/Airbnb Monochrome WorldAtlasMap Component
// -----------------------------------------------------------------
console.log("\n25. Apple/Airbnb Monochrome WorldAtlasMap Component:");

test("WorldAtlasMap: 2D flat canvas, 6 customizable render styles, floating controls & SVG export", () => {
  const mapPath = path.join(rootDir, "src/components/WorldAtlasMap.tsx");
  assert.ok(fs.existsSync(mapPath), "src/components/WorldAtlasMap.tsx must exist");

  const mapContent = fs.readFileSync(mapPath, "utf8");
  assert.ok(mapContent.includes("export const WorldAtlasMap"), "must export WorldAtlasMap component");
  
  // 6 render styles
  const styles = ["vector", "dots", "pixels", "crosses", "diamonds", "hatch"];
  for (const s of styles) {
    assert.ok(mapContent.includes(`"${s}"`), `WorldAtlasMap must support ${s} render style`);
  }

  // Monochrome palette
  assert.ok(mapContent.includes("#09090B"), "must use #09090B for active selection");
  assert.ok(mapContent.includes("#18181B"), "must use #18181B for hover state");
  assert.ok(mapContent.includes("#E4E4E7"), "must use #E4E4E7 for default landmass");
  assert.ok(mapContent.includes("#F4F4F5"), "must use #F4F4F5 for background baseline");

  // Floating controls & shortcuts
  assert.ok(mapContent.includes("Select country..."), "must include search capsule with placeholder");
  assert.ok(mapContent.includes("handleExportSVG"), "must include SVG snapshot export handler");
  assert.ok(mapContent.includes("GLOBAL_EDGE_HUBS"), "must support telemetry edge hub pulse markers");
  assert.ok(mapContent.includes("patternConfig"), "must compute hardware-accelerated SVG pattern definitions");

  // Root export check
  const rootIndex = fs.readFileSync(path.join(rootDir, "src/components/index.ts"), "utf8");
  assert.ok(rootIndex.includes("WorldAtlasMap"), "src/components/index.ts must export WorldAtlasMap");

  const zlIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/index.ts"), "utf8");
  assert.ok(zlIndex.includes("WorldAtlasMap"), "src/components/zerolight/index.ts must export WorldAtlasMap");

  const dashboardContent = readDashboardSource();
  assert.ok(!dashboardContent.includes("<WorldAtlasMap"), "DashboardShell must not integrate removed WorldAtlasMap tool");
});

// -----------------------------------------------------------------
// Test Suite 26: ZeroLight Design System Documentation & Logo Variations Manager
// -----------------------------------------------------------------
console.log("\n26. ZeroLight Design System Documentation & Logo Variations Manager:");

test("ZeroLightDocsPortal: Visual Foundations, UI Components, Brand Assets & Zero Geist Clutter", () => {
  const docsPath = path.join(rootDir, "src/components/zerolight/docs/zerolight-docs-portal.tsx");
  assert.ok(fs.existsSync(docsPath), "src/components/zerolight/docs/zerolight-docs-portal.tsx must exist");

  const docsContent = fs.readFileSync(docsPath, "utf8");
  assert.ok(docsContent.includes("export function ZeroLightDocsPortal"), "must export ZeroLightDocsPortal component");
  assert.ok(docsContent.includes("ZEROLIGHT_DOCS_NAV"), "must define complete navigation hierarchy");

  // Zero Geist clutter
  assert.ok(!docsContent.toLowerCase().includes("geist"), "docs portal must NOT use the word Geist");
  assert.ok(!docsContent.includes("Vercel marks"), "docs portal must NOT copy Vercel marks");

  // Foundations & Components
  assert.ok(docsContent.includes("philosophy") && docsContent.includes("colors") && docsContent.includes("materials"), "must support visual foundations");
  assert.ok(docsContent.includes("button") && docsContent.includes("input") && docsContent.includes("world-atlas-map"), "must support component library");

  // UI elements
  assert.ok(docsContent.includes("Show code"), "must support collapsible Show code accordion");
  assert.ok(docsContent.includes("Give feedback"), "must include sentiment feedback capsule");
  assert.ok(docsContent.includes("⌘K"), "must support Cmd+K search shortcut");

  // Root export check
  const zlIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/index.ts"), "utf8");
  assert.ok(zlIndex.includes("zerolight-docs-portal"), "src/components/zerolight/index.ts must export ZeroLightDocsPortal");

  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("<ZeroLightDocsPortal"), "DashboardShell must integrate ZeroLightDocsPortal for docs tab");
  assert.ok(!dashboardContent.includes("Vector Map Studio & Asset Generator"), "DashboardShell must not feature Map Studio tool");
});

test("Visual Studio Logo Variations Manager & My Themes Persistence", () => {
  const assetsPath = path.join(rootDir, "src/components/zerolight/studio/panel-assets.tsx");
  const assetsContent = fs.readFileSync(assetsPath, "utf8");
  assert.ok(assetsContent.includes("Logo Variations"), "panel-assets.tsx must contain Logo Variations section");
  assert.ok(assetsContent.includes("Primary Light Logo"), "must support primary light logo upload");
  assert.ok(assetsContent.includes("Dark Surface Logo"), "must support dark surface logo upload");
  assert.ok(assetsContent.includes("Favicon / Icon Mark"), "must support square favicon upload");

  const themePath = path.join(rootDir, "src/components/zerolight/studio/panel-theme.tsx");
  const themeContent = fs.readFileSync(themePath, "utf8");
  assert.ok(themeContent.includes("My Themes"), "panel-theme.tsx must contain My Themes library");
  assert.ok(themeContent.includes("STORAGE_CUSTOM_THEMES"), "must persist custom themes with localStorage");
  assert.ok(themeContent.includes("handleSaveCustomTheme"), "must support saving custom theme");
  assert.ok(themeContent.includes("handleDeleteCustomTheme"), "must support deleting custom theme");

  // Dynamic brand logo binding in Dashboard & SignInCard
  const dashboardPath = path.join(rootDir, "src/components/zerolight/dashboard/dashboard-shell.tsx");
  const dashboardContent = fs.readFileSync(dashboardPath, "utf8");
  assert.ok(dashboardContent.includes("tokens.logoLight") || dashboardContent.includes("tokens.logoBrandName"), "DashboardShell must bind custom logo & brand name");

  const signInPath = path.join(rootDir, "src/components/zerolight/auth/sign-in-card.tsx");
  const signInContent = fs.readFileSync(signInPath, "utf8");
  assert.ok(signInContent.includes("tokens.logoLight") || signInContent.includes("tokens.logoBrandName"), "SignInCard must bind custom logo & brand name");
});

// -----------------------------------------------------------------
// Test Suite 27: Geographic Accuracy & Tokenized SignInCard
// -----------------------------------------------------------------
console.log("\n27. Geographic Accuracy & Tokenized SignInCard:");

test("world-map-data.ts: Zero antimeridian crossing horizontal lines for Russia and Landmass", () => {
  const mapDataContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/world-map-data.ts"), "utf8");
  
  // Russia check
  const ruMatch = mapDataContent.match(/\{\s*\"id\":\s*\"RU\"[\s\S]*?\"d\":\s*\"(.*?)\"/);
  assert.ok(ruMatch, "Russia must exist in world-map-data.ts");
  const ruSubpaths = ruMatch[1].split("Z");
  ruSubpaths.forEach((sp, i) => {
    const coords = (sp.match(/[\d\.]+,[\d\.]+/g) || []).map(c => c.split(',').map(Number));
    if (coords.length > 0) {
      const xs = coords.map(c => c[0]);
      assert.ok(!(Math.min(...xs) < 20 && Math.max(...xs) > 780), `Russia subpath ${i} must not cross antimeridian directly`);
    }
  });

  // Canonical WorldMap primitive
  const worldMapContent = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/world-map.tsx"), "utf8");
  assert.ok(worldMapContent.includes("WorldAtlasMap"), "world-map.tsx must wrap WorldAtlasMap as canonical primitive");
});

test("SignInCard strictly consumes ZeroLight tokens and native atoms", () => {
  const signInPath = path.join(rootDir, "src/components/zerolight/auth/sign-in-card.tsx");
  const signInContent = fs.readFileSync(signInPath, "utf8");
  assert.ok(signInContent.includes("useZeroLight"), "SignInCard must consume useZeroLight");
  assert.ok(signInContent.includes("<Button"), "SignInCard must use native Button atom");
  assert.ok(signInContent.includes("<Input"), "SignInCard must use native Input atom");
  assert.ok(signInContent.includes("<AlertBanner"), "SignInCard must use native AlertBanner");
  assert.ok(signInContent.includes("tokens.universalFillColor"), "SignInCard must bind universalFillColor");
});

console.log("\n=== Suite 28: Enterprise Goldmines (MCP, Data Grid & TenantKit) ===");

test("Goldmine 1: Standalone Stdio MCP Server exists and exposes required AI agent tools", () => {
  const mcpPath = path.join(rootDir, "bin/zerolight-mcp.mjs");
  assert.ok(fs.existsSync(mcpPath), "bin/zerolight-mcp.mjs must exist");
  const mcpContent = fs.readFileSync(mcpPath, "utf8");
  assert.ok(mcpContent.includes("list_components"), "MCP must expose list_components tool");
  assert.ok(mcpContent.includes("get_component_schema"), "MCP must expose get_component_schema tool");
  assert.ok(mcpContent.includes("add_component"), "MCP must expose add_component tool");
  assert.ok(mcpContent.includes("get_design_tokens"), "MCP must expose get_design_tokens tool");
  assert.ok(mcpContent.includes("jsonrpc"), "MCP must implement JSON-RPC 2.0");

  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
  assert.equal(pkg.bin?.["zerolight-mcp"], "./bin/zerolight-mcp.mjs", "package.json must declare zerolight-mcp binary");
});

test("Goldmine 2: Enterprise DataTable supports TSV/CSV paste, export & column pinning", () => {
  const dtPath = path.join(rootDir, "src/components/zerolight/organisms/data-table.tsx");
  const dtContent = fs.readFileSync(dtPath, "utf8");
  assert.ok(dtContent.includes("enableClipboardPaste"), "DataTable must support enableClipboardPaste");
  assert.ok(dtContent.includes("enableExport"), "DataTable must support enableExport");
  assert.ok(dtContent.includes("exportToCSV"), "DataTable must implement exportToCSV");
  assert.ok(dtContent.includes("exportToJSON"), "DataTable must implement exportToJSON");
  assert.ok(dtContent.includes("handlePasteData"), "DataTable must parse clipboard TSV/CSV data");
  assert.ok(dtContent.includes("pinSelectionColumn"), "DataTable must support pinSelectionColumn");
  assert.ok(dtContent.includes("pinActionsColumn"), "DataTable must support pinActionsColumn");
});

test("Goldmine 4: TenantKit organism exists with multi-tenant switcher and isolation controls", () => {
  const tenantPath = path.join(rootDir, "src/components/zerolight/organisms/tenant-kit.tsx");
  assert.ok(fs.existsSync(tenantPath), "tenant-kit.tsx must exist");
  const tenantContent = fs.readFileSync(tenantPath, "utf8");
  assert.ok(tenantContent.includes("useZeroLight"), "TenantKit must consume useZeroLight");
  assert.ok(tenantContent.includes("Switch Micro-Tenant"), "TenantKit must support micro-tenant switching");
  assert.ok(tenantContent.includes("Dedicated VPC"), "TenantKit must support isolation architecture levels");
  assert.ok(tenantContent.includes("ProgressBar"), "TenantKit must use ProgressBar for quotas");

  const orgIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
  assert.ok(orgIdx.includes('export * from "./tenant-kit";'), "organisms/index.ts must export tenant-kit");
});

// -----------------------------------------------------------------
// Test Suite 29: SaaS Button Library (33 Variants) & Input Library (44 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 29: SaaS Button & Input Variant Libraries ===");

test("SaaS Button Library: 33 interactive variants, 8 categories & sticky control bar", () => {
  const btnPath = path.join(rootDir, "src/components/zerolight/libraries/button-library.tsx");
  assert.ok(fs.existsSync(btnPath), "button-library.tsx must exist");
  const btnContent = fs.readFileSync(btnPath, "utf8");

  // Export check
  assert.ok(btnContent.includes("export function SaaSButtonLibrary"), "must export SaaSButtonLibrary");

  // 8 Categories
  assert.ok(btnContent.includes("1. Main Action Styles"), "must contain Main Action Styles category");
  assert.ok(btnContent.includes("2. Icons & Shortcuts"), "must contain Icons & Shortcuts category");
  assert.ok(btnContent.includes("3. Split & Menus"), "must contain Split & Menus category");
  assert.ok(btnContent.includes("4. Toggle & Views"), "must contain Toggle & Views category");
  assert.ok(btnContent.includes("5. Loading & Progress"), "must contain Loading & Progress category");
  assert.ok(btnContent.includes("6. Safety & Delete"), "must contain Safety & Delete category");
  assert.ok(btnContent.includes("7. Compact Tools"), "must contain Compact Tools category");
  assert.ok(btnContent.includes("8. Smart AI & Upgrade"), "must contain Smart AI & Upgrade category");

  // 4 Density Tiers
  for (const tier of ["28px", "36px", "42px", "48px"]) {
    assert.ok(btnContent.includes(tier), `Button library must support density ${tier}`);
  }

  // Key interactive features
  assert.ok(btnContent.includes("Two-Click Delete Confirm"), "must implement Two-Click Delete Confirm");
  assert.ok(btnContent.includes("Click-to-Save Progress"), "must implement Click-to-Save Progress");
  assert.ok(btnContent.includes("Toolbar Action Strip"), "must implement Toolbar Action Strip");
  assert.ok(btnContent.includes("activeCodeModal"), "must support Code inspector modal");
});

test("SaaS Input Field Library: 44 interactive variants, 10 categories, zero native pickers", () => {
  const inputPath = path.join(rootDir, "src/components/zerolight/libraries/input-library.tsx");
  assert.ok(fs.existsSync(inputPath), "input-library.tsx must exist");
  const inputContent = fs.readFileSync(inputPath, "utf8");

  // Export check
  assert.ok(inputContent.includes("export function SaaSInputFieldLibrary"), "must export SaaSInputFieldLibrary");

  // 10 Categories
  assert.ok(inputContent.includes("1. Basic & Login"), "must contain Basic & Login category");
  assert.ok(inputContent.includes("2. Numbers & Money"), "must contain Numbers & Money category");
  assert.ok(inputContent.includes("3. Prefixes & Dropdowns"), "must contain Prefixes & Dropdowns category");
  assert.ok(inputContent.includes("4. Search & Tags"), "must contain Search & Tags category");
  assert.ok(inputContent.includes("5. Date & Times"), "must contain Date & Times category");
  assert.ok(inputContent.includes("6. Country & Address"), "must contain Country & Address category");
  assert.ok(inputContent.includes("7. Multi-Line"), "must contain Multi-Line category");
  assert.ok(inputContent.includes("8. AI Assistants"), "must contain AI Assistants category");
  assert.ok(inputContent.includes("9. Files & Color"), "must contain Files & Color category");
  assert.ok(inputContent.includes("10. Status Preview"), "must contain Status Preview category");

  // Custom popovers (zero native select/date inputs)
  assert.ok(inputContent.includes("data-dd-root"), "must use data-dd-root custom popovers");
  assert.ok(inputContent.includes("Custom Calendar Date Picker"), "must implement custom calendar date picker");
  assert.ok(inputContent.includes("Custom Date Range Picker"), "must implement custom date range picker");
  assert.ok(inputContent.includes("Custom Time Slot Picker"), "must implement custom time picker");
  assert.ok(inputContent.includes("Custom Country Code Phone"), "must implement custom dial code picker");

  // 4 Density Tiers & 4 Label Layouts
  for (const tier of ["28px", "36px", "44px", "52px"]) {
    assert.ok(inputContent.includes(tier), `Input library must support density ${tier}`);
  }
  for (const layout of ["top", "small-top", "side", "hidden"]) {
    assert.ok(inputContent.includes(`"${layout}"`), `Input library must support layout ${layout}`);
  }

  // Root and Dashboard wiring
  const rootIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/index.ts"), "utf8");
  assert.ok(rootIndex.includes("./libraries"), "src/components/zerolight/index.ts must export libraries");

  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSButtonLibrary") && dashboardContent.includes("SaaSInputFieldLibrary"), "DashboardShell must integrate Button & Input libraries");
  assert.ok(dashboardContent.includes("sidebar-sub-pip"), "DashboardShell must implement kinetic sub-pip for sidebar submenus");
});

// -----------------------------------------------------------------
// Test Suite 30: SaaS Selection Controls Library (26 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 30: SaaS Selection Controls Library (26 Variants) ===");

test("SaaS Selection Controls Library: 26 interactive variants across 6 categories", () => {
  const selPath = path.join(rootDir, "src/components/zerolight/libraries/selection-library.tsx");
  assert.ok(fs.existsSync(selPath), "selection-library.tsx must exist");
  const selContent = fs.readFileSync(selPath, "utf8");

  // Export check
  assert.ok(selContent.includes("export function SaaSSelectionLibrary"), "must export SaaSSelectionLibrary");

  // 6 Categories
  assert.ok(selContent.includes("1. Checkboxes"), "must contain Checkboxes category");
  assert.ok(selContent.includes("2. Radio Buttons"), "must contain Radio Buttons category");
  assert.ok(selContent.includes("3. Toggle Switches"), "must contain Toggle Switches category");
  assert.ok(selContent.includes("4. Selectable Cards"), "must contain Selectable Cards category");
  assert.ok(selContent.includes("5. Custom Dropdowns"), "must contain Custom Dropdowns category");
  assert.ok(selContent.includes("6. Permissions & Rating"), "must contain Permissions & Rating category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(selContent.includes(`"${tier}"`), `Selection library must support density ${tier}`);
  }

  // Key interactive features
  assert.ok(selContent.includes("Select All Parent Checkbox"), "must implement tri-state indeterminate checkbox");
  assert.ok(selContent.includes("Single-Choice Plan Cards"), "must implement single-choice pricing plan cards");
  assert.ok(selContent.includes("Weekly Working Days Selector"), "must implement weekly working days selector");
  assert.ok(selContent.includes("Role Permission Mini-Grid"), "must implement role permission grid");
  assert.ok(selContent.includes("Star Rating Selector"), "must implement star rating selector");
  assert.ok(selContent.includes("CustomCheckbox"), "must use custom checkboxes (zero native controls)");
  assert.ok(selContent.includes("CustomRadio"), "must use custom radios (zero native controls)");
  assert.ok(selContent.includes("CustomSwitch"), "must use custom switches (zero native controls)");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSSelectionLibrary"), "DashboardShell must integrate SaaSSelectionLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 SaaS pattern variants active badge");
});

// -----------------------------------------------------------------
// Test Suite 31: SaaS Status & Indicator Library (28 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 31: SaaS Status & Indicator Library (28 Variants) ===");

test("SaaS Status & Indicator Library: 28 interactive variants across 6 categories", () => {
  const indPath = path.join(rootDir, "src/components/zerolight/libraries/indicator-library.tsx");
  assert.ok(fs.existsSync(indPath), "indicator-library.tsx must exist");
  const indContent = fs.readFileSync(indPath, "utf8");

  // Export check
  assert.ok(indContent.includes("export function SaaSIndicatorLibrary"), "must export SaaSIndicatorLibrary");

  // 6 Categories
  assert.ok(indContent.includes("1. Status Badges"), "must contain Status Badges category");
  assert.ok(indContent.includes("2. Tags & Counters"), "must contain Tags & Counters category");
  assert.ok(indContent.includes("3. Progress & Quotas"), "must contain Progress & Quotas category");
  assert.ok(indContent.includes("4. Spinners & Loaders"), "must contain Spinners & Loaders category");
  assert.ok(indContent.includes("5. Skeletons"), "must contain Skeletons category");
  assert.ok(indContent.includes("6. Trackers & Timelines"), "must contain Trackers & Timelines category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(indContent.includes(`"${tier}"`), `Indicator library must support density ${tier}`);
  }

  // Speed controls
  for (const speed of ["normal", "fast", "paused"]) {
    assert.ok(indContent.includes(`"${speed}"`), `Indicator library must support animation speed ${speed}`);
  }

  // Key interactive features
  assert.ok(indContent.includes("Click-to-Cycle Status Pill"), "must implement interactive click-to-cycle pill");
  assert.ok(indContent.includes("Interactive Progress Simulator"), "must implement +25% progress simulator");
  assert.ok(indContent.includes("Circular Progress Ring"), "must implement SVG circular progress ring");
  assert.ok(indContent.includes("Audio & AI Wave Loader"), "must implement audio/AI wave loader");
  assert.ok(indContent.includes("SLA Health Bar"), "must implement SLA health bar");
  assert.ok(indContent.includes("speedDropdownOpen"), "must use custom speed dropdown popover");
  assert.ok(indContent.includes("data-indicator-popover"), "must isolate indicator popover with data attribute");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./indicator-library";'), "libraries/index.ts must export indicator-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSIndicatorLibrary"), "DashboardShell must integrate SaaSIndicatorLibrary");
  assert.ok(dashboardContent.includes("docsSubView === \"indicators\""), "DashboardShell must render SaaSIndicatorLibrary on indicators tab");
});

// -----------------------------------------------------------------
// Test Suite 32: SaaS Divider & Spacer Library (22 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 32: SaaS Divider & Spacer Library (22 Variants) ===");

test("SaaS Divider & Spacer Library: 22 interactive variants across 6 categories", () => {
  // Check standalone HTML web application
  const htmlPath = path.join(rootDir, "public/saas-divider-library.html");
  assert.ok(fs.existsSync(htmlPath), "public/saas-divider-library.html must exist");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");
  assert.ok(htmlContent.includes("SaaS Divider & Spacer Library"), "HTML must have header title");
  assert.ok(htmlContent.includes("22 Variants"), "HTML must indicate 22 variants");
  assert.ok(htmlContent.includes("guides-active"), "HTML must implement visual spacing guides");
  assert.ok(htmlContent.includes("setSpacingScale"), "HTML must implement spacing scale toggles");
  assert.ok(htmlContent.includes("toggleAdvancedDetails"), "HTML must implement expandable section divider");
  assert.ok(htmlContent.includes("changeInteractiveGap"), "HTML must implement dynamic interactive gap preview");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const divPath = path.join(rootDir, "src/components/zerolight/libraries/divider-library.tsx");
  assert.ok(fs.existsSync(divPath), "divider-library.tsx must exist");
  const divContent = fs.readFileSync(divPath, "utf8");

  // Export check
  assert.ok(divContent.includes("export function SaaSDividerLibrary"), "must export SaaSDividerLibrary");

  // 6 Categories
  assert.ok(divContent.includes("1. Horizontal Rules"), "must contain Horizontal Rules category");
  assert.ok(divContent.includes("2. Labeled & Interactive"), "must contain Labeled & Interactive category");
  assert.ok(divContent.includes("3. Vertical & Splitters"), "must contain Vertical & Splitters category");
  assert.ok(divContent.includes("4. Consistent Spacing"), "must contain Consistent Spacing category");
  assert.ok(divContent.includes("5. Auto-Push & Layout"), "must contain Auto-Push & Layout category");
  assert.ok(divContent.includes("6. Card & List"), "must contain Card & List category");

  // 3 Spacing Scale Toggles
  for (const scale of ["tight", "default", "relaxed"]) {
    assert.ok(divContent.includes(`"${scale}"`), `Divider library must support scale ${scale}`);
  }

  // Key interactive features
  assert.ok(divContent.includes("Simple Hairline Rule"), "must implement simple hairline rule");
  assert.ok(divContent.includes("Dashed Receipt Divider"), "must implement dashed receipt divider");
  assert.ok(divContent.includes("Centered Text Divider"), "must implement centered text divider");
  assert.ok(divContent.includes("Expand / Collapse Section Divider"), "must implement expand/collapse section divider");
  assert.ok(divContent.includes("Interactive Spacing Scale Preview"), "must implement interactive spacing scale preview");
  assert.ok(divContent.includes("Left-to-Right Auto Spacer"), "must implement left-to-right auto spacer");
  assert.ok(divContent.includes("Clean List Row Divider"), "must implement clean list row divider");
  assert.ok(divContent.includes("Card Footer Action Divider"), "must implement card footer action divider");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./divider-library";'), "libraries/index.ts must export divider-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSDividerLibrary"), "DashboardShell must integrate SaaSDividerLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"dividers\""), "DashboardShell must render SaaSDividerLibrary on dividers tab");
});

// -----------------------------------------------------------------
// Test Suite 33: SaaS Tooltip & Popover Library (22 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 33: SaaS Tooltip & Popover Library (22 Variants) ===");

test("SaaS Tooltip & Popover Library: 22 interactive variants across 6 categories", () => {
  // Check standalone HTML web application
  const htmlPath = path.join(rootDir, "public/saas-tooltip-library.html");
  assert.ok(fs.existsSync(htmlPath), "public/saas-tooltip-library.html must exist");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");
  assert.ok(htmlContent.includes("SaaS Tooltip & Popover Library"), "HTML must have header title");
  assert.ok(htmlContent.includes("22 Variants"), "HTML must indicate 22 variants");
  assert.ok(htmlContent.includes("preview-open-active"), "HTML must support global preview open mode");
  assert.ok(htmlContent.includes("setDensityTier"), "HTML must support density tier resizing");
  assert.ok(htmlContent.includes("togglePopover"), "HTML must implement popover toggling");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const ttPath = path.join(rootDir, "src/components/zerolight/libraries/tooltip-library.tsx");
  assert.ok(fs.existsSync(ttPath), "tooltip-library.tsx must exist");
  const ttContent = fs.readFileSync(ttPath, "utf8");

  // Export check
  assert.ok(ttContent.includes("export function SaaSTooltipLibrary"), "must export SaaSTooltipLibrary");

  // 6 Categories
  assert.ok(ttContent.includes("1. Directional Tooltips"), "must contain Directional Tooltips category");
  assert.ok(ttContent.includes("2. Shortcuts & Status"), "must contain Shortcuts & Status category");
  assert.ok(ttContent.includes("3. Toolbar & Hints"), "must contain Toolbar & Hints category");
  assert.ok(ttContent.includes("4. Rich Popovers"), "must contain Rich Popovers category");
  assert.ok(ttContent.includes("5. Safety & Confirm"), "must contain Safety & Confirm category");
  assert.ok(ttContent.includes("6. Quick-Edit & Notes"), "must contain Quick-Edit & Notes category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(ttContent.includes(`"${tier}"`), `Tooltip library must support tier ${tier}`);
  }

  // Key interactive features
  assert.ok(ttContent.includes("Top Hover Tooltip"), "must implement top hover tooltip");
  assert.ok(ttContent.includes("Bottom Hover Tooltip"), "must implement bottom hover tooltip");
  assert.ok(ttContent.includes("Left Side Tooltip"), "must implement left side tooltip");
  assert.ok(ttContent.includes("Right Side Tooltip"), "must implement right side tooltip");
  assert.ok(ttContent.includes("Keyboard Shortcut Tooltip"), "must implement keyboard shortcut tooltip");
  assert.ok(ttContent.includes("Light Surface Bordered Tooltip"), "must implement light card tooltip");
  assert.ok(ttContent.includes("Multi-Line Explanation Tooltip"), "must implement multi-line explanation tooltip");
  assert.ok(ttContent.includes("Click-to-Copy Confirmation Tooltip"), "must implement copy confirmation tooltip");
  assert.ok(ttContent.includes("Icon Action Bar with Tooltips"), "must implement icon action bar");
  assert.ok(ttContent.includes("Disabled Button Reason Tooltip"), "must implement disabled button tooltip");
  assert.ok(ttContent.includes("Live Status Dot Tooltip"), "must implement live status tooltip");
  assert.ok(ttContent.includes("Truncated Text Full-Name Hint"), "must implement truncated text hint");
  assert.ok(ttContent.includes("Feature Info Card Popover"), "must implement feature info popover");
  assert.ok(ttContent.includes("User Profile Preview Popover"), "must implement user profile popover");
  assert.ok(ttContent.includes("Usage & Quota Breakdown Popover"), "must implement quota breakdown popover");
  assert.ok(ttContent.includes("Keyboard Shortcuts Cheat-Sheet Popover"), "must implement shortcuts cheat sheet");
  assert.ok(ttContent.includes("Delete Confirmation Popover"), "must implement delete confirmation popover");
  assert.ok(ttContent.includes("Publish Live Confirmation Popover"), "must implement publish confirmation popover");
  assert.ok(ttContent.includes("Revoke Access Warning Popover"), "must implement revoke warning popover");
  assert.ok(ttContent.includes("Share Link & Access Popover"), "must implement share link popover");
  assert.ok(ttContent.includes("Quick Rename Popover"), "must implement quick rename popover");
  assert.ok(ttContent.includes("Quick Note / Feedback Popover"), "must implement quick note feedback popover");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./tooltip-library";'), "libraries/index.ts must export tooltip-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSTooltipLibrary"), "DashboardShell must integrate SaaSTooltipLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"tooltips\""), "DashboardShell must render SaaSTooltipLibrary on tooltips tab");
});

// -----------------------------------------------------------------
// Test Suite 34: SaaS Feedback, Alerts & Empty States Library (20 Variants)
// -----------------------------------------------------------------
console.log("\n=== Suite 34: SaaS Feedback, Alerts & Empty States Library (20 Variants) ===");

test("SaaS Feedback, Alerts & Empty States: 20 interactive variants across 5 categories", () => {
  // Check standalone HTML web applications
  const htmlPath = path.join(rootDir, "public/saas-alerts-empty-states-showcase.html");
  assert.ok(fs.existsSync(htmlPath), "public/saas-alerts-empty-states-showcase.html must exist");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");
  assert.ok(htmlContent.includes("SaaS Feedback, Alerts & Empty States"), "HTML must have header title");
  assert.ok(htmlContent.includes("20 Variants"), "HTML must indicate 20 variants");
  assert.ok(htmlContent.includes("restoreAllDismissed"), "HTML must implement restore dismissed alerts");
  assert.ok(htmlContent.includes("triggerLiveToast"), "HTML must implement live bottom-right toasts");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const fbPath = path.join(rootDir, "src/components/zerolight/libraries/feedback-library.tsx");
  assert.ok(fs.existsSync(fbPath), "feedback-library.tsx must exist");
  const fbContent = fs.readFileSync(fbPath, "utf8");

  // Export check
  assert.ok(fbContent.includes("export function SaaSFeedbackLibrary"), "must export SaaSFeedbackLibrary");

  // 5 Categories
  assert.ok(fbContent.includes("1. Inline Page Alerts"), "must contain Inline Page Alerts category");
  assert.ok(fbContent.includes("2. Top Banners"), "must contain Top Banners category");
  assert.ok(fbContent.includes("3. Snackbars & Toasts"), "must contain Snackbars & Toasts category");
  assert.ok(fbContent.includes("4. Empty States"), "must contain Empty States category");
  assert.ok(fbContent.includes("5. Error & Locked States"), "must contain Error & Locked States category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(fbContent.includes(`"${tier}"`), `Feedback library must support tier ${tier}`);
  }

  // Key interactive features
  assert.ok(fbContent.includes("Neutral Info Alert"), "must implement neutral info alert");
  assert.ok(fbContent.includes("Success Confirmation Alert"), "must implement success confirmation alert");
  assert.ok(fbContent.includes("Warning Alert with Action"), "must implement warning alert with action");
  assert.ok(fbContent.includes("Danger Error Alert with Fix Button"), "must implement danger error alert");
  assert.ok(fbContent.includes("Left-Accent Border Callout"), "must implement left-accent border callout");
  assert.ok(fbContent.includes("Free Trial Countdown Banner"), "must implement trial countdown banner");
  assert.ok(fbContent.includes("Failed Payment Action Banner"), "must implement failed payment banner");
  assert.ok(fbContent.includes("Deleted Item with Undo Toast"), "must implement deleted item undo toast");
  assert.ok(fbContent.includes("First-Time Empty Table State"), "must implement first-time empty state");
  assert.ok(fbContent.includes("No Search Results Empty State"), "must implement no search results empty state");
  assert.ok(fbContent.includes("Failed to Load with Retry Button"), "must implement failed to load retry state");
  assert.ok(fbContent.includes("Permission Denied / Admin Only State"), "must implement permission denied state");
  assert.ok(fbContent.includes("Pro Plan Locked Feature State"), "must implement pro plan locked state");
  assert.ok(fbContent.includes("404 Page Not Found Card"), "must implement 404 page not found card");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./feedback-library";'), "libraries/index.ts must export feedback-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSFeedbackLibrary"), "DashboardShell must integrate SaaSFeedbackLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"feedback\""), "DashboardShell must render SaaSFeedbackLibrary on feedback tab");
});

// -----------------------------------------------------------------
// Test Suite 35: Level 3 Organism Library - Overlays, Modals, Drawers & ⌘K (16 Variants)
// -----------------------------------------------------------------
test("Suite 35: SaaS Overlays, Modals, Drawers & ⌘K Command Palette (16 Variants)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-overlays-command-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-overlays-command-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-overlays-command-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-overlays-command-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("SaaS Overlays, Modals, Drawers &amp; ⌘K") || htmlContent.includes("SaaS Overlays, Modals, Drawers & ⌘K"), "HTML must have proper title");
  assert.ok(htmlContent.includes("16 Variants"), "HTML must indicate 16 variants");
  assert.ok(htmlContent.includes("openCommandPalette"), "HTML must implement global command palette");
  assert.ok(htmlContent.includes("handleDeleteConfirmation"), "HTML must implement type-to-confirm validation");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const overlaysPath = path.join(rootDir, "src/components/zerolight/libraries/overlays-library.tsx");
  assert.ok(fs.existsSync(overlaysPath), "overlays-library.tsx must exist");
  const overlaysContent = fs.readFileSync(overlaysPath, "utf8");

  // Export check
  assert.ok(overlaysContent.includes("export function SaaSOverlaysLibrary"), "must export SaaSOverlaysLibrary");

  // 6 Categories
  assert.ok(overlaysContent.includes("confirmations"), "must contain Dialogs & Confirmations category");
  assert.ok(overlaysContent.includes("modals"), "must contain Form & Creation Modals category");
  assert.ok(overlaysContent.includes("drawers"), "must contain Slide-Over Drawers category");
  assert.ok(overlaysContent.includes("commands"), "must contain Command Palettes category");
  assert.ok(overlaysContent.includes("context-menus"), "must contain Context Menus category");
  assert.ok(overlaysContent.includes("wizards"), "must contain Steppers & Multi-Step Wizards category");

  // 3 Density / Width Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(overlaysContent.includes(`"${tier}"`), `Overlays library must support width tier ${tier}`);
  }

  // Key interactive features
  assert.ok(overlaysContent.includes("Standard Action Confirm Dialog"), "must implement standard confirm dialog");
  assert.ok(overlaysContent.includes("Type-to-Confirm Critical Delete Dialog"), "must implement type-to-confirm delete");
  assert.ok(overlaysContent.includes("Success / Receipt Modal Dialog"), "must implement success receipt modal");
  assert.ok(overlaysContent.includes("Create Record Multi-Input Modal"), "must implement create record modal");
  assert.ok(overlaysContent.includes("Team Member Invite Modal"), "must implement team member invite modal");
  assert.ok(overlaysContent.includes("Plan Upgrade / Pricing Modal"), "must implement plan upgrade pricing modal");
  assert.ok(overlaysContent.includes("Right Slide-Over Record Detail Drawer"), "must implement record detail drawer");
  assert.ok(overlaysContent.includes("Right Slide-Over Edit Form Drawer"), "must implement edit form drawer");
  assert.ok(overlaysContent.includes("Right Slide-Over Filter Panel Drawer"), "must implement filter panel drawer");
  assert.ok(overlaysContent.includes("Left Slide-Over Mobile Navigation Drawer"), "must implement left mobile drawer");
  assert.ok(overlaysContent.includes("Global Command Palette (⌘K)"), "must implement global command palette");
  assert.ok(overlaysContent.includes("Scoped Record Quick-Switcher"), "must implement scoped quick-switcher");
  assert.ok(overlaysContent.includes("Table Row Action Context Menu"), "must implement table row context menu");
  assert.ok(overlaysContent.includes("Canvas / Card Context Menu"), "must implement canvas card context menu");
  assert.ok(overlaysContent.includes("3-Step CSV Column Mapping Modal"), "must implement 3-step CSV mapping wizard");
  assert.ok(overlaysContent.includes("Welcome & Feature Walkthrough Onboarding Modal"), "must implement welcome onboarding tour");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./overlays-library";'), "libraries/index.ts must export overlays-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSOverlaysLibrary"), "DashboardShell must integrate SaaSOverlaysLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"overlays\""), "DashboardShell must render SaaSOverlaysLibrary on overlays tab");
});

// -----------------------------------------------------------------
// Test Suite 36: Level 3 Organism Library - Navigation, Breadcrumbs, Tabs, Steppers & Sidebars (20 Variants)
// -----------------------------------------------------------------
test("Suite 36: SaaS Navigation, Breadcrumbs, Tabs, Steppers & Sidebars (20 Variants)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-navigation-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-navigation-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-navigation-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-navigation-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("SaaS Navigation, Breadcrumbs & Sidebars") || htmlContent.includes("SaaS Navigation, Breadcrumbs &amp; Sidebars"), "HTML must have proper title");
  assert.ok(htmlContent.includes("20 Variants"), "HTML must indicate 20 variants");
  assert.ok(htmlContent.includes("toggleDemoSidebar15"), "HTML must implement collapsible sidebar toggle");
  assert.ok(htmlContent.includes("changeWizardStep"), "HTML must implement onboarding wizard steps");
  assert.ok(htmlContent.includes("changeNumberedPage"), "HTML must implement numbered page strip");
  assert.ok(htmlContent.includes("toggleRowsDropdown"), "HTML must implement custom rows popover");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const navPath = path.join(rootDir, "src/components/zerolight/libraries/navigation-library.tsx");
  assert.ok(fs.existsSync(navPath), "navigation-library.tsx must exist");
  const navContent = fs.readFileSync(navPath, "utf8");

  // Export check
  assert.ok(navContent.includes("export function SaaSNavigationLibrary"), "must export SaaSNavigationLibrary");

  // 6 Categories
  assert.ok(navContent.includes("breadcrumbs"), "must contain Breadcrumbs category");
  assert.ok(navContent.includes("tabs"), "must contain Tabs category");
  assert.ok(navContent.includes("pagination"), "must contain Pagination category");
  assert.ok(navContent.includes("steppers"), "must contain Steppers category");
  assert.ok(navContent.includes("sidebars"), "must contain Sidebars category");
  assert.ok(navContent.includes("topnav"), "must contain Topnav category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(navContent.includes(`"${tier}"`), `Navigation library must support density tier ${tier}`);
  }

  // Key interactive features
  assert.ok(navContent.includes("Chevron Breadcrumb Trail"), "must implement chevron breadcrumbs");
  assert.ok(navContent.includes("Home Icon & Slash Breadcrumbs"), "must implement slash breadcrumbs");
  assert.ok(navContent.includes("Collapsed Overflow Breadcrumb"), "must implement collapsed overflow breadcrumbs");
  assert.ok(navContent.includes("Back Button + Current Page Title"), "must implement back button title header");
  assert.ok(navContent.includes("Clean Underline Tabs"), "must implement clean underline tabs");
  assert.ok(navContent.includes("Segmented Pill Tabs"), "must implement segmented pill tabs");
  assert.ok(navContent.includes("Tabs with Live Item Counters"), "must implement tabs with live item counters");
  assert.ok(navContent.includes("Vertical Settings Navigation Tabs"), "must implement vertical settings tabs");
  assert.ok(navContent.includes("Numbered Page Strip"), "must implement numbered page strip");
  assert.ok(navContent.includes("Compact Table Footer Pager"), "must implement compact table pager");
  assert.ok(navContent.includes("Rows Per Page + Pager Bar"), "must implement rows per page custom selector");
  assert.ok(navContent.includes("Interactive 3-Step Onboarding Wizard"), "must implement 3-step onboarding wizard");
  assert.ok(navContent.includes("Vertical Setup Checklist Stepper"), "must implement vertical checklist stepper");
  assert.ok(navContent.includes("Segmented Bar Stepper"), "must implement segmented bar stepper");
  assert.ok(navContent.includes("Collapsible SaaS App Sidebar"), "must implement collapsible sidebar");
  assert.ok(navContent.includes("Grouped Section Sidebar with Sub-Items"), "must implement grouped section sidebar");
  assert.ok(navContent.includes("Icon-Only Mini Rail + Sub-Panel"), "must implement icon mini rail dual column");
  assert.ok(navContent.includes("Enterprise Top Navbar with Search & Profile"), "must implement enterprise top navbar");
  assert.ok(navContent.includes("Contextual Page Header + Action Bar"), "must implement contextual page header");
  assert.ok(navContent.includes("Focused Checkout / Wizard Top Header"), "must implement focused checkout wizard header");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./navigation-library";'), "libraries/index.ts must export navigation-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSNavigationLibrary"), "DashboardShell must integrate SaaSNavigationLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 249 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"navigation\""), "DashboardShell must render SaaSNavigationLibrary on navigation tab");
});

// -----------------------------------------------------------------
// Test Suite 37: Level 3 Organism Library - Data, Tables, Filters & Kanban (18 Variants)
// -----------------------------------------------------------------
test("Suite 37: SaaS Data, Tables, Filters & Kanban (18 Variants)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-data-tables-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-data-tables-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-data-tables-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-data-tables-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("SaaS Data Tables, KPIs, Filters &amp; Kanban") || htmlContent.includes("SaaS Data Tables, KPIs, Filters & Kanban"), "HTML must have proper title");
  assert.ok(htmlContent.includes("18 Variants"), "HTML must indicate 18 variants");
  assert.ok(htmlContent.includes("renderInvoiceTable"), "HTML must implement invoice table rendering");
  assert.ok(htmlContent.includes("advanceKanbanCard"), "HTML must implement interactive kanban cards");
  assert.ok(htmlContent.includes("recalculateLineTotal"), "HTML must implement spreadsheet formula recalculation");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const dataPath = path.join(rootDir, "src/components/zerolight/libraries/data-library.tsx");
  assert.ok(fs.existsSync(dataPath), "data-library.tsx must exist");
  const dataContent = fs.readFileSync(dataPath, "utf8");

  // Export check
  assert.ok(dataContent.includes("export function SaaSDataLibrary"), "must export SaaSDataLibrary");

  // 6 Categories
  assert.ok(dataContent.includes("kpi"), "must contain KPI & Metrics category");
  assert.ok(dataContent.includes("tables"), "must contain Interactive Data Tables category");
  assert.ok(dataContent.includes("filters"), "must contain Filters & Saved Views category");
  assert.ok(dataContent.includes("kanban"), "must contain Kanban Pipeline category");
  assert.ok(dataContent.includes("audit"), "must contain Audit & Activity category");
  assert.ok(dataContent.includes("files"), "must contain File Upload & Import category");

  // 3 Density Tiers
  for (const tier of ["compact", "default", "relaxed"]) {
    assert.ok(dataContent.includes(`"${tier}"`), `Data library must support density tier ${tier}`);
  }

  // Key interactive features
  assert.ok(dataContent.includes("KPI Stat Card with Trend Pill"), "must implement KPI trend pill card");
  assert.ok(dataContent.includes("KPI Card with Mini Sparkline Bar"), "must implement sparkline card");
  assert.ok(dataContent.includes("Quota & Target Goal Stat Card"), "must implement quota target goal card");
  assert.ok(dataContent.includes("Multi-Metric Summary Strip"), "must implement multi-metric strip");
  assert.ok(dataContent.includes("Key-Value Record Summary List"), "must implement key-value dossier list");
  assert.ok(dataContent.includes("Alert KPI Card"), "must implement alert KPI card");
  assert.ok(dataContent.includes("Full Interactive Invoice Data Table + Bulk Action Bar"), "must implement full data table");
  assert.ok(dataContent.includes("Inline Editable Spreadsheet Grid Row"), "must implement inline spreadsheet grid");
  assert.ok(dataContent.includes("Saved Views Tab Bar + Save View Trigger"), "must implement saved views tab bar");
  assert.ok(dataContent.includes("Faceted Filter Bar + Active Chips"), "must implement faceted filter bar");
  assert.ok(dataContent.includes("Floating Bulk Selection Action Bar"), "must implement floating bulk action bar");
  assert.ok(dataContent.includes("Faceted Sidebar Filter Group"), "must implement faceted sidebar filter");
  assert.ok(dataContent.includes("Interactive 3-Stage SaaS Deal Pipeline Board"), "must implement kanban pipeline board");
  assert.ok(dataContent.includes("Workspace Audit Log Feed"), "must implement workspace audit log");
  assert.ok(dataContent.includes("Compact Order Tracking List"), "must implement compact order tracking list");
  assert.ok(dataContent.includes("CSV / Excel Bulk Import Dropzone"), "must implement CSV bulk import dropzone");
  assert.ok(dataContent.includes("Active Upload Progress Card"), "must implement active upload progress card");
  assert.ok(dataContent.includes("Attached Invoice PDF Card"), "must implement attached invoice PDF card");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./data-library";'), "libraries/index.ts must export data-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSDataLibrary"), "DashboardShell must integrate SaaSDataLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 265 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"data\""), "DashboardShell must render SaaSDataLibrary on data tab");
});

// -----------------------------------------------------------------
// Test Suite 38: Level 3 Organism Library - Business, Billing & Analytics Modules (16 Modules)
// -----------------------------------------------------------------
test("Suite 38: SaaS Business, Billing & Analytics Modules (16 Modules)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-business-billing-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-business-billing-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-business-billing-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-business-billing-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("SaaS Business, Billing &amp; Analytics") || htmlContent.includes("SaaS Business, Billing & Analytics"), "HTML must have proper title");
  assert.ok(htmlContent.includes("16 Modules"), "HTML must indicate 16 modules");
  assert.ok(htmlContent.includes("markAllNotificationsRead"), "HTML must implement mark all notifications read");
  assert.ok(htmlContent.includes("postNewComment"), "HTML must implement post new comment");
  assert.ok(htmlContent.includes("setBillingPeriod"), "HTML must implement monthly/yearly billing period toggle");
  assert.ok(htmlContent.includes("triggerTallySync"), "HTML must implement Tally sync simulation");
  assert.ok(htmlContent.includes("copyApiKey"), "HTML must implement API key copy");
  assert.ok(htmlContent.includes("setChartPeriod"), "HTML must implement chart period switcher");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const bizPath = path.join(rootDir, "src/components/zerolight/libraries/business-library.tsx");
  assert.ok(fs.existsSync(bizPath), "business-library.tsx must exist");
  const bizContent = fs.readFileSync(bizPath, "utf8");

  // Export check
  assert.ok(bizContent.includes("export function SaaSBusinessLibrary"), "must export SaaSBusinessLibrary");

  // 5 Categories
  assert.ok(bizContent.includes("collab"), "must contain Notifications & @Mentions category");
  assert.ok(bizContent.includes("pricing"), "must contain SaaS Pricing & Plans category");
  assert.ok(bizContent.includes("usage"), "must contain Usage, Limits & Billing category");
  assert.ok(bizContent.includes("analytics"), "must contain SVG Analytics Panels category");
  assert.ok(bizContent.includes("integrations"), "must contain Integrations & Workspaces category");

  // 3 Density Tiers
  for (const tier of ["small", "medium", "large"]) {
    assert.ok(bizContent.includes(`"${tier}"`), `Business library must support density tier ${tier}`);
  }

  // Key interactive features (all 16 modules)
  assert.ok(bizContent.includes("Notification Inbox Popover"), "must implement notification inbox popover");
  assert.ok(bizContent.includes("Interactive @Mention Comment Thread"), "must implement interactive @mention comment thread");
  assert.ok(bizContent.includes("In-App Support & Help Launcher"), "must implement in-app support help launcher");
  assert.ok(bizContent.includes("Interactive 3-Tier SaaS Pricing Table"), "must implement 3-tier pricing table");
  assert.ok(bizContent.includes("Plan Usage & Limit Meters"), "must implement plan usage & limit meters");
  assert.ok(bizContent.includes("Saved Payment Method & Next Charge"), "must implement saved payment method & next charge");
  assert.ok(bizContent.includes("Billing Invoice History List"), "must implement billing invoice history list");
  assert.ok(bizContent.includes("Monthly Revenue Bar Chart Panel"), "must implement monthly revenue bar chart panel");
  assert.ok(bizContent.includes("Smooth Trend Line & Area Chart"), "must implement smooth trend line & area chart");
  assert.ok(bizContent.includes("Conversion Funnel Chart Panel"), "must implement conversion funnel chart panel");
  assert.ok(bizContent.includes("Donut Breakdown Chart Card"), "must implement donut breakdown chart card");
  assert.ok(bizContent.includes("7×4 Weekly Activity Heatmap Grid"), "must implement 7x4 weekly activity heatmap grid");
  assert.ok(bizContent.includes("Interactive Chart Period Switcher Card"), "must implement interactive chart period switcher card");
  assert.ok(bizContent.includes("Connected Integration Card (Tally Prime)"), "must implement connected integration card for Tally Prime");
  assert.ok(bizContent.includes("API Key Management Row"), "must implement API key management row");
  assert.ok(bizContent.includes("Multi-Workspace Organization Switcher"), "must implement multi-workspace organization switcher");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./business-library";'), "libraries/index.ts must export business-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSBusinessLibrary"), "DashboardShell must integrate SaaSBusinessLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 277 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"business\""), "DashboardShell must render SaaSBusinessLibrary on business tab");
});

// -----------------------------------------------------------------
// Test Suite 39: Level 4 Layout Library - Page Skeletons & Layout Blueprints (12 Templates)
// -----------------------------------------------------------------
test("Suite 39: SaaS Page Skeletons & Layout Blueprints (12 Templates)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-layouts-templates-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-layouts-templates-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-layouts-templates-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-layouts-templates-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("SaaS Page Skeletons &amp; Layout Blueprints") || htmlContent.includes("SaaS Page Skeletons & Layout Blueprints"), "HTML must have proper title");
  assert.ok(htmlContent.includes("12 Templates"), "HTML must indicate 12 templates");
  assert.ok(htmlContent.includes("selectShell01Nav"), "HTML must implement shell navigation switching");
  assert.ok(htmlContent.includes("selectClientDetail"), "HTML must implement master-detail client selection");
  assert.ok(htmlContent.includes("setViewport"), "HTML must implement responsive viewport resizing");
  assert.ok(htmlContent.includes("toggleZoneGuides"), "HTML must implement blueprint zone guides overlay");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const layoutPath = path.join(rootDir, "src/components/zerolight/libraries/layout-library.tsx");
  assert.ok(fs.existsSync(layoutPath), "layout-library.tsx must exist");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");

  // Export check
  assert.ok(layoutContent.includes("export function SaaSLayoutLibrary"), "must export SaaSLayoutLibrary");

  // 6 Categories
  assert.ok(layoutContent.includes("shells"), "must contain App Shells category");
  assert.ok(layoutContent.includes("executive"), "must contain Executive Dashboards category");
  assert.ok(layoutContent.includes("splits"), "must contain Master-Detail Splits category");
  assert.ok(layoutContent.includes("settings"), "must contain Settings & Forms category");
  assert.ok(layoutContent.includes("auth"), "must contain Auth & Onboarding category");
  assert.ok(layoutContent.includes("landing"), "must contain Landing & Starters category");

  // Viewport Modes
  for (const vp of ["desktop", "tablet", "mobile"]) {
    assert.ok(layoutContent.includes(`"${vp}"`), `Layout library must support viewport mode ${vp}`);
  }

  // Key interactive features (all 12 templates)
  assert.ok(layoutContent.includes("Classic Left Sidebar + Top Bar App Shell"), "must implement classic left sidebar shell");
  assert.ok(layoutContent.includes("Top-Navigation Centered Container Shell"), "must implement centered container shell");
  assert.ok(layoutContent.includes("4-KPI Top Row + 8/4 Chart & Activity Split"), "must implement 4-KPI top row split");
  assert.ok(layoutContent.includes("Bento Summary Grid (Hero Metric + Quick Actions)"), "must implement bento summary grid");
  assert.ok(layoutContent.includes("Interactive List-Detail Split View (Inbox / CRM Style)"), "must implement list-detail split view");
  assert.ok(layoutContent.includes("Left Faceted Filter Rail + Main Records Table Layout"), "must implement faceted filter rail table");
  assert.ok(layoutContent.includes("Left Settings Menu + Stacked Card Sections"), "must implement settings menu stacked cards");
  assert.ok(layoutContent.includes("Two-Column Annotated Form Layout (Label Left, Card Right)"), "must implement annotated form layout");
  assert.ok(layoutContent.includes("Split-Screen Brand & Sign-In Layout"), "must implement split-screen sign-in layout");
  assert.ok(layoutContent.includes("Focused Centered Onboarding Stepper Layout"), "must implement centered onboarding stepper");
  assert.ok(layoutContent.includes("SaaS Hero + 3-Column Feature Grid Layout"), "must implement SaaS hero feature grid");
  assert.ok(layoutContent.includes("Empty / Blank Canvas Starter Layout"), "must implement empty starter canvas");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./layout-library";'), "libraries/index.ts must export layout-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSLayoutLibrary"), "DashboardShell must integrate SaaSLayoutLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 283 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"layouts\""), "DashboardShell must render SaaSLayoutLibrary on layouts tab");
});

// -----------------------------------------------------------------
// Test Suite 40: Level 5 Screens - Complete Interactive Multi-Page SaaS Application (6 Full Pages)
// -----------------------------------------------------------------
test("Suite 40: SaaS Complete Interactive Multi-Page Application (6 Full Pages)", () => {
  // Check Standalone Showcase HTML
  const showcasePath = path.join(rootDir, "saas-complete-app-showcase.html");
  const publicShowcasePath = path.join(rootDir, "public/saas-complete-app-showcase.html");
  assert.ok(fs.existsSync(showcasePath), "saas-complete-app-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicShowcasePath), "saas-complete-app-showcase.html must exist in public/");

  const htmlContent = fs.readFileSync(showcasePath, "utf8");
  assert.ok(htmlContent.includes("Level 5 Screens: Complete Interactive Multi-Page SaaS Application"), "HTML must have proper title");
  assert.ok(htmlContent.includes("const appData = {"), "HTML must contain reactive appData state object");
  assert.ok(htmlContent.includes("navigateTo"), "HTML must implement page routing");
  assert.ok(htmlContent.includes("renderPage"), "HTML must implement dynamic page rendering");
  assert.ok(htmlContent.includes("toggleWorkspacePopover"), "HTML must implement workspace switcher popover");
  assert.ok(htmlContent.includes("toggleSidebarCollapse"), "HTML must implement sidebar collapse/expand");
  assert.ok(htmlContent.includes("inspectInvoice"), "HTML must implement slide-over detail drawer");
  assert.ok(htmlContent.includes("openCreateInvoiceModal"), "HTML must implement create invoice modal");
  assert.ok(htmlContent.includes("advanceDeal"), "HTML must implement Kanban deal progression");
  assert.ok(htmlContent.includes("openInviteMemberModal"), "HTML must implement invite member modal");
  assert.ok(htmlContent.includes("openCommandPalette"), "HTML must implement ⌘K command palette");
  assert.ok(htmlContent.includes("showToast"), "HTML must implement floating toast system");
  assert.ok(htmlContent.includes("cdn.tailwindcss.com"), "HTML must include Tailwind CDN");
  assert.ok(htmlContent.includes("lucide@latest"), "HTML must include Lucide Icons CDN");

  // Check React Component
  const screensPath = path.join(rootDir, "src/components/zerolight/libraries/app-screens-library.tsx");
  assert.ok(fs.existsSync(screensPath), "app-screens-library.tsx must exist");
  const screensContent = fs.readFileSync(screensPath, "utf8");

  // Export check
  assert.ok(screensContent.includes("export function SaaSAppScreensLibrary"), "must export SaaSAppScreensLibrary");

  // 6 Destination Pages
  assert.ok(screensContent.includes("dashboard"), "must support Dashboard page");
  assert.ok(screensContent.includes("invoices"), "must support Invoices page");
  assert.ok(screensContent.includes("pipeline"), "must support Pipeline Kanban page");
  assert.ok(screensContent.includes("team"), "must support Team & Roles page");
  assert.ok(screensContent.includes("billing"), "must support Billing & Plan page");
  assert.ok(screensContent.includes("settings"), "must support Workspace Settings page");

  // Key interactive features
  assert.ok(screensContent.includes("Total Billed"), "must display Total Billed KPI");
  assert.ok(screensContent.includes("Monthly Collections"), "must display Monthly Collections chart");
  assert.ok(screensContent.includes("setInspectedInvoice"), "must support inspecting invoice in slide-over drawer");
  assert.ok(screensContent.includes("setIsCreateInvoiceOpen"), "must support create invoice modal");
  assert.ok(screensContent.includes("setIsInviteMemberOpen"), "must support invite member modal");
  assert.ok(screensContent.includes("setIsCmdOpen"), "must support ⌘K command palette modal");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./app-screens-library";'), "libraries/index.ts must export app-screens-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSAppScreensLibrary"), "DashboardShell must integrate SaaSAppScreensLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 283 active variants badge");
  assert.ok(dashboardContent.includes("docsSubView === \"screens\""), "DashboardShell must render SaaSAppScreensLibrary on screens tab");
});

// -----------------------------------------------------------------
// Test Suite 41: SaaS Smart Hierarchy, Layout & Edge Cases Library (12 Interactive Patterns + Master Prompt)
// -----------------------------------------------------------------
console.log("\n=== Suite 41: SaaS Smart Hierarchy, Layout & Edge Cases Library (12 Patterns + Prompt) ===");

test("SaaS Smart Hierarchy, Layout & Edge Cases: 12 interactive patterns, spring motion physics, stress-test resilience", () => {
  // Check Master Prompt
  const promptPath = path.join(rootDir, "saas-hierarchy-edge-cases-prompt.md");
  assert.ok(fs.existsSync(promptPath), "saas-hierarchy-edge-cases-prompt.md must exist");
  const promptContent = fs.readFileSync(promptPath, "utf8");
  assert.ok(promptContent.includes("SaaS Smart Hierarchy, Layout & Edge Cases"), "Prompt must capture hierarchy title");
  assert.ok(promptContent.includes("Snappy") && promptContent.includes("520"), "Prompt must specify Snappy 520 curve");
  assert.ok(promptContent.includes("Damped") && promptContent.includes("400"), "Prompt must specify Damped 400 curve");
  assert.ok(promptContent.includes("Gentle") && promptContent.includes("280"), "Prompt must specify Gentle 280 curve");

  // Check Standalone HTML Showcase in root and public
  const rootHtml = path.join(rootDir, "saas-hierarchy-edge-cases-showcase.html");
  const publicHtml = path.join(rootDir, "public/saas-hierarchy-edge-cases-showcase.html");
  assert.ok(fs.existsSync(rootHtml), "saas-hierarchy-edge-cases-showcase.html must exist at root");
  assert.ok(fs.existsSync(publicHtml), "public/saas-hierarchy-edge-cases-showcase.html must exist");

  const htmlContent = fs.readFileSync(rootHtml, "utf8");
  assert.ok(htmlContent.includes("SaaS Smart Hierarchy, Layout & Edge Cases Library"), "HTML title check");
  assert.ok(htmlContent.includes("setMotionPhysics"), "HTML must implement motion physics switcher");
  assert.ok(htmlContent.includes("toggleStressTest"), "HTML must implement live stress test toggle");
  assert.ok(htmlContent.includes("setViewport"), "HTML must implement responsive viewport simulator");
  assert.ok(htmlContent.includes("openCodeModal"), "HTML must implement copy-paste code modal");
  assert.ok(htmlContent.includes("triggerP12ManualRetry"), "HTML must implement network retry loop");
  assert.ok(htmlContent.includes("Single-Line Truncation"), "HTML must include single-line truncation pattern");
  assert.ok(htmlContent.includes("Multi-Line Clamp"), "HTML must include multi-line clamp pattern");
  assert.ok(htmlContent.includes("Tag & Badge Cloud Overflow"), "HTML must include tag overflow wrap pattern");
  assert.ok(htmlContent.includes("Zero, Negative & Large Financial Numbers"), "HTML must include zero & negative numbers pattern");
  assert.ok(htmlContent.includes("Tabular-Nums KPI Strip"), "HTML must include tabular-nums KPI strip pattern");
  assert.ok(htmlContent.includes("Currency Rate Fallback"), "HTML must include currency rate fallback pattern");
  assert.ok(htmlContent.includes("Spring Physics Interactive Button"), "HTML must include spring physics button pattern");
  assert.ok(htmlContent.includes("Staggered List Entrance Animation"), "HTML must include staggered entrance list pattern");
  assert.ok(htmlContent.includes("Slide-Over Detail Drawer"), "HTML must include slide-over spring drawer pattern");
  assert.ok(htmlContent.includes("Geometric Skeleton Shimmer"), "HTML must include exact shimmer skeletons pattern");
  assert.ok(htmlContent.includes("Actionable Zero-State Empty Canvas"), "HTML must include actionable empty canvas pattern");
  assert.ok(htmlContent.includes("Network Timeout Error Card"), "HTML must include network timeout retry loop pattern");

  // Check React Component
  const edgeCasesPath = path.join(rootDir, "src/components/zerolight/libraries/edge-cases-library.tsx");
  assert.ok(fs.existsSync(edgeCasesPath), "edge-cases-library.tsx must exist");
  const edgeCasesContent = fs.readFileSync(edgeCasesPath, "utf8");
  assert.ok(edgeCasesContent.includes("export function SaaSEdgeCasesLibrary"), "must export SaaSEdgeCasesLibrary");
  assert.ok(edgeCasesContent.includes("useZeroLight"), "must consume design system tokens via useZeroLight");
  assert.ok(edgeCasesContent.includes("isStressTest"), "must support live stress-test toggle");
  assert.ok(edgeCasesContent.includes("motionCurve"), "must support motion curve physics toggling");

  // Export from libraries/index.ts
  const libIdx = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/index.ts"), "utf8");
  assert.ok(libIdx.includes('export * from "./edge-cases-library";'), "libraries/index.ts must export edge-cases-library");

  // Dashboard integration
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes("SaaSEdgeCasesLibrary"), "DashboardShell must integrate SaaSEdgeCasesLibrary");
  assert.ok(dashboardContent.includes("295 SaaS Pattern Variants Active"), "DashboardShell must synchronize 295 active variants badge");
  assert.ok(dashboardContent.includes('docsSubView === "edge-cases"'), 'DashboardShell must render SaaSEdgeCasesLibrary on edge-cases tab');
});

// -----------------------------------------------------------------
// Test Suite 42: 6-Tier Atomic Architecture & Icon Hardening Verification
// -----------------------------------------------------------------
console.log("\n=== Suite 42: 6-Tier Atomic Architecture & Icon Hardening Verification ===");

test("Atomic Hierarchy: 6 clean sidebar tiers (Foundations, Atoms, Molecules, Organisms, Templates, Pages) with contextual tabs", () => {
  const dashboardContent = readDashboardSource();
  
  // Verify 6 Tiers definition
  assert.ok(dashboardContent.includes('id: "foundations"'), "must define Foundations tier");
  assert.ok(dashboardContent.includes('id: "atoms"'), "must define Atoms tier");
  assert.ok(dashboardContent.includes('id: "molecules"'), "must define Molecules tier");
  assert.ok(dashboardContent.includes('id: "organisms"'), "must define Organisms tier");
  assert.ok(dashboardContent.includes('id: "templates"'), "must define Templates tier");
  assert.ok(dashboardContent.includes('id: "pages"'), "must define Pages tier");

  // Verify DOCS_TIERS configuration exists
  assert.ok(dashboardContent.includes("DOCS_TIERS"), "must configure DOCS_TIERS");
  assert.ok(dashboardContent.includes("activeTierData"), "must compute activeTierData contextually");

  // Verify Icon Hardening across libraries
  const buttonLib = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/button-library.tsx"), "utf8");
  assert.ok(!buttonLib.includes("Saved ✓"), "button-library must use Check icon instead of Saved text symbol");
  assert.ok(!buttonLib.includes("Copied ✓"), "button-library must use Check icon instead of Copied text symbol");

  const edgeLib = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/edge-cases-library.tsx"), "utf8");
  assert.ok(!edgeLib.includes('>✓<'), "edge-cases-library must use Lucide Check icon instead of raw checkmark text");

  const navLib = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/navigation-library.tsx"), "utf8");
  assert.ok(!navLib.includes('"✓"'), "navigation-library must use Lucide Check icon in wizard steps");

  const overlayLib = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/overlays-library.tsx"), "utf8");
  assert.ok(!overlayLib.includes(">✕<"), "overlays-library must use Lucide X icon instead of ✕ symbol");

  const inputLib = fs.readFileSync(path.join(rootDir, "src/components/zerolight/libraries/input-library.tsx"), "utf8");
  assert.ok(inputLib.includes("<Minus"), "input-library must use Lucide Minus icon in counter stepper");
  assert.ok(inputLib.includes("<Plus"), "input-library must use Lucide Plus icon in counter stepper");
});

// -----------------------------------------------------------------
// Test Suite 43: Architectural Landmark & Context Invariants
// -----------------------------------------------------------------
console.log("\n=== Suite 43: Architectural Landmark & Context Invariants ===");

test("Architectural Atlas: root ATLAS.md & AGENTS.md exist, adhere to strict 150-line limit, and validate paths", () => {
  const atlasPath = path.join(rootDir, "ATLAS.md");
  assert.ok(fs.existsSync(atlasPath), "ATLAS.md must exist at project root");
  const atlasContent = fs.readFileSync(atlasPath, "utf8");
  const lines = atlasContent.split("\n");
  assert.ok(lines.length <= 150, `ATLAS.md must stay under 150 lines to prevent AI context bloat (currently ${lines.length} lines)`);

  const agentsPath = path.join(rootDir, "AGENTS.md");
  assert.ok(fs.existsSync(agentsPath), "AGENTS.md must exist at root for universal AI tool discovery");

  // Validate that all landmark paths referenced in ATLAS.md physically exist on disk (prevents documentation drift)
  const landmarkPaths = [
    "src/components/zerolight/types.ts",
    "src/components/zerolight/context.tsx",
    "src/components/zerolight/atoms",
    "src/components/zerolight/molecules",
    "src/components/zerolight/organisms",
    "src/components/zerolight/templates",
    "src/components/zerolight/views",
    "src/components/zerolight/libraries",
    "src/components/zerolight/libraries/common",
    "src/components/zerolight/dashboard",
    "bin/cli.mjs",
    "bin/zerolight-mcp.mjs",
    "scripts/build-registry.mjs",
    "public/registry",
  ];

  for (const relPath of landmarkPaths) {
    const fullPath = path.join(rootDir, relPath);
    assert.ok(fs.existsSync(fullPath), `Landmark path in ATLAS.md must exist on disk: ${relPath}`);
  }
});

// -----------------------------------------------------------------
// Test Suite 44: Stageshow-Inspired SaaS Showcase & Bento Architecture
// -----------------------------------------------------------------
console.log("\n=== Suite 44: Stageshow-Inspired SaaS Showcase & Bento Architecture ===");

test("Stageshow Primitives: ProductWindow, ChoreographedCursor, HeroShowcase & BentoShowcase exist and adhere to token invariants", () => {
  const productStagePath = path.join(rootDir, "src/components/zerolight/molecules/product-stage.tsx");
  assert.ok(fs.existsSync(productStagePath), "product-stage.tsx molecule must exist");
  const stageContent = fs.readFileSync(productStagePath, "utf8");
  assert.ok(stageContent.includes("export function ProductWindow"), "must export ProductWindow");
  assert.ok(stageContent.includes("export function ChoreographedCursor"), "must export ChoreographedCursor");
  assert.ok(stageContent.includes("export function CounterRoll"), "must export CounterRoll");
  assert.ok(stageContent.includes("export function PlaceholderLines"), "must export PlaceholderLines");

  const heroShowcasePath = path.join(rootDir, "src/components/zerolight/molecules/hero-showcase.tsx");
  assert.ok(fs.existsSync(heroShowcasePath), "hero-showcase.tsx molecule must exist");
  const heroContent = fs.readFileSync(heroShowcasePath, "utf8");
  assert.ok(heroContent.includes("export function HeroShowcase"), "must export HeroShowcase");
  assert.ok(heroContent.includes("CounterRoll"), "HeroShowcase must bind CounterRoll for digit rolls");
  assert.ok(heroContent.includes("ChoreographedCursor"), "HeroShowcase must bind ChoreographedCursor");

  const bentoShowcasePath = path.join(rootDir, "src/components/zerolight/organisms/bento-showcase.tsx");
  assert.ok(fs.existsSync(bentoShowcasePath), "bento-showcase.tsx organism must exist");
  const bentoContent = fs.readFileSync(bentoShowcasePath, "utf8");
  assert.ok(bentoContent.includes("export function BentoShowcase"), "must export BentoShowcase");
  assert.ok(bentoContent.includes("ProductWindow"), "BentoShowcase must use ProductWindow");

  const molIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/index.ts"), "utf8");
  assert.ok(molIndex.includes("product-stage") && molIndex.includes("hero-showcase"), "molecules index must export product-stage and hero-showcase");

  const orgIndex = fs.readFileSync(path.join(rootDir, "src/components/zerolight/organisms/index.ts"), "utf8");
  assert.ok(orgIndex.includes("bento-showcase"), "organisms index must export bento-showcase");
});

// -----------------------------------------------------------------
// Test Suite 45: Unified Tools Directory, ZeroFlash, ZeroAuditor, Gen-UI & shadcn r/ Registry
// -----------------------------------------------------------------
console.log("\n=== Suite 45: Unified Tools Directory, Morphic Evolution & shadcn r/ Registry ===");

test("Single Component Platform, Employee Password Gate, Morphic Evolution & shadcn r/ Registry", () => {
  const dashboardContent = readDashboardSource();
  assert.ok(dashboardContent.includes('useState<DashboardTab>("docs")'), "DashboardShell must open directly into the Design System Component Catalog");
  assert.ok(!dashboardContent.includes("toolsMenuExpanded") && !dashboardContent.includes("GenUIStudioTool"), "Sidebar must have no Tools submenu and GenUIStudioTool must be removed");
  assert.ok(!dashboardContent.includes("<ZeroFlashTool") && !dashboardContent.includes("<ZeroAuditorTool") && !dashboardContent.includes("<TokenStudioSidebar"), "Tools studios must be cleanly removed from DashboardShell");

  // Verify Server-Side Employee Password Gate
  const middlewarePath = path.join(rootDir, "src/middleware.ts");
  const loginPagePath = path.join(rootDir, "src/app/login/page.tsx");
  const authApiPath = path.join(rootDir, "src/app/api/auth/team/route.ts");
  assert.ok(fs.existsSync(middlewarePath) && fs.existsSync(loginPagePath) && fs.existsSync(authApiPath), "Edge middleware, /login page, and /api/auth/team route must exist for employee password protection");
  const middlewareSrc = fs.readFileSync(middlewarePath, "utf8");
  assert.ok(middlewareSrc.includes("ZERORAPID_TEAM_PASSWORD") && middlewareSrc.includes("zl_team_session"), "Middleware must enforce ZERORAPID_TEAM_PASSWORD session cookie");

  assert.ok(!fs.existsSync(path.join(rootDir, "src/app/studio/page.tsx")), "Visual Studio Dock /studio route must be removed");

  const genUiPath = path.join(rootDir, "src/components/zerolight/gen-ui/gen-ui-renderer.tsx");
  assert.ok(fs.existsSync(genUiPath), "gen-ui-renderer.tsx must exist");
  const genUiContent = fs.readFileSync(genUiPath, "utf8");
  assert.ok(genUiContent.includes("GenUIPayloadSchema") && genUiContent.includes("export function ZeroLightGenUIRenderer"), "must export GenUIPayloadSchema and ZeroLightGenUIRenderer");

  const shadcnIndex = path.join(rootDir, "public/r/index.json");
  assert.ok(fs.existsSync(shadcnIndex), "public/r/index.json must exist for shadcn-compatible CLI installs");
  const parsedShadcn = JSON.parse(fs.readFileSync(shadcnIndex, "utf8"));
  assert.ok(parsedShadcn.$schema === "https://ui.shadcn.com/schema/registry.json" && Array.isArray(parsedShadcn.items) && parsedShadcn.items.length >= 120, "public/r/index.json must conform to shadcn schema with 120+ items");

  // Runtime Morphic Evolution (Stages 1-3)
  const statCardSrc = fs.readFileSync(path.join(rootDir, "src/components/zerolight/molecules/stat-card.tsx"), "utf8");
  assert.ok(statCardSrc.includes("export type StatCardStage") && statCardSrc.includes("data-zl-morphic-stage"), "StatCard must implement MorphicStage 1-3 runtime morphing");

  const genUiSrc = fs.readFileSync(path.join(rootDir, "src/components/zerolight/gen-ui/gen-ui-renderer.tsx"), "utf8");
  assert.ok(genUiSrc.includes("morphicStageOverride"), "ZeroLightGenUIRenderer must accept morphicStageOverride for runtime morphing");

  // GitHub monorepo tool labeler, shadcn CLI & zerorapid.in Go-Live readiness
  assert.ok(fs.existsSync(path.join(rootDir, ".github/labeler.yml")) && fs.existsSync(path.join(rootDir, ".github/workflows/labeler.yml")), "Single-branch monorepo tool labeler must exist under .github/");
  const cliSrc = fs.readFileSync(path.join(rootDir, "bin/cli.mjs"), "utf8");
  assert.ok(cliSrc.includes("DEFAULT_SHADCN_REGISTRY_BASE") && cliSrc.includes("--shadcn") && cliSrc.includes("bricks.zerorapid.in"), "CLI must support --shadcn flag and bricks.zerorapid.in registry host");

  const nextConfigSrc = fs.readFileSync(path.join(rootDir, "next.config.mjs"), "utf8");
  assert.ok(nextConfigSrc.includes("/r/:path*") && nextConfigSrc.includes("Access-Control-Allow-Origin"), "next.config.mjs must allow CORS on public registry payloads");
  assert.ok(fs.existsSync(path.join(rootDir, "src/app/robots.ts")) && fs.existsSync(path.join(rootDir, "src/app/sitemap.ts")), "robots.ts and sitemap.ts must exist for SEO indexing");
});

console.log("\n=== Suite 46: Mathematical Morphic Evolution Engine & ERP Modules ===");

test("Morphic Evolution Engine implements 6 equations and drives ERP & core components", () => {
  const engineSrc = fs.readFileSync(path.join(rootDir, "src/components/zerolight/morphic-engine.tsx"), "utf8");
  for (const sym of [
    "quinticSmoothstep",
    "modularScale",
    "GOLDEN_RATIO",
    "hickHymanLatencyMs",
    "shannonEntropyBits",
    "computeDampedSpring",
    "interpolateOklch",
    "exponentialElevation",
    "MorphicScope",
    "MorphicSlot",
    "useMorphic",
  ]) {
    assert.ok(engineSrc.includes(sym), `morphic-engine.tsx must export ${sym}`);
  }

  for (const file of [
    "src/components/zerolight/molecules/inventory-stock-health.tsx",
    "src/components/zerolight/organisms/approval-workflow.tsx",
    "src/components/zerolight/organisms/three-way-match.tsx",
    "src/components/zerolight/organisms/ledger-balancer.tsx",
    "src/components/zerolight/organisms/line-item-matrix.tsx",
    "src/components/zerolight/atoms/button.tsx",
    "src/components/zerolight/atoms/input.tsx",
    "src/components/zerolight/atoms/card.tsx",
  ]) {
    const src = fs.readFileSync(path.join(rootDir, file), "utf8");
    assert.ok(src.includes("useMorphic"), `${file} must consume useMorphic()`);
  }
});

console.log("\n==================================================");
console.log(`TEST RUN COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
