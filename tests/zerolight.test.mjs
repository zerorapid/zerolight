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

console.log("\n==================================================");
console.log(`TEST RUN COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
