/**
 * ZeroLight Composition Engine
 * Governs what to use, how much to use, where to use, how to adapt, and when to stop.
 */

export type ScreenArchetype =
  | "simple-dashboard"
  | "analytics-dashboard"
  | "erp-workbench"
  | "ai-chat"
  | "ai-agent-console"
  | "billing-workspace"
  | "settings-workspace"
  | "auth-screen";

export type SpatialDensity = "compact" | "standard" | "comfortable";

export interface ArchetypeBudget {
  archetype: ScreenArchetype;
  maxMajorRegions: number;
  maxContentModules: number;
  maxStatCards: number;
  maxCharts: number;
  maxPrimaryActions: number;
  defaultDensity: SpatialDensity;
}

export const ARCHETYPE_BUDGETS: Record<ScreenArchetype, ArchetypeBudget> = {
  "auth-screen": {
    archetype: "auth-screen",
    maxMajorRegions: 2,
    maxContentModules: 4,
    maxStatCards: 0,
    maxCharts: 0,
    maxPrimaryActions: 1,
    defaultDensity: "comfortable",
  },
  "simple-dashboard": {
    archetype: "simple-dashboard",
    maxMajorRegions: 3,
    maxContentModules: 7,
    maxStatCards: 4,
    maxCharts: 1,
    maxPrimaryActions: 1,
    defaultDensity: "standard",
  },
  "analytics-dashboard": {
    archetype: "analytics-dashboard",
    maxMajorRegions: 4,
    maxContentModules: 10,
    maxStatCards: 4,
    maxCharts: 2,
    maxPrimaryActions: 1,
    defaultDensity: "standard",
  },
  "erp-workbench": {
    archetype: "erp-workbench",
    maxMajorRegions: 4,
    maxContentModules: 9,
    maxStatCards: 4,
    maxCharts: 1,
    maxPrimaryActions: 1,
    defaultDensity: "compact",
  },
  "ai-chat": {
    archetype: "ai-chat",
    maxMajorRegions: 3,
    maxContentModules: 5,
    maxStatCards: 0,
    maxCharts: 0,
    maxPrimaryActions: 1,
    defaultDensity: "standard",
  },
  "ai-agent-console": {
    archetype: "ai-agent-console",
    maxMajorRegions: 4,
    maxContentModules: 8,
    maxStatCards: 3,
    maxCharts: 1,
    maxPrimaryActions: 1,
    defaultDensity: "compact",
  },
  "billing-workspace": {
    archetype: "billing-workspace",
    maxMajorRegions: 4,
    maxContentModules: 7,
    maxStatCards: 3,
    maxCharts: 1,
    maxPrimaryActions: 1,
    defaultDensity: "standard",
  },
  "settings-workspace": {
    archetype: "settings-workspace",
    maxMajorRegions: 3,
    maxContentModules: 6,
    maxStatCards: 0,
    maxCharts: 0,
    maxPrimaryActions: 1,
    defaultDensity: "standard",
  },
};

export interface ComponentCompositionMeta {
  id: string;
  visualWeight: number;
  surfaceWeight: number;
  recommendedMinWidth: number;
  preferredContexts: ScreenArchetype[];
  avoidContexts: ScreenArchetype[];
}

export const COMPONENT_COMPOSITION_META: Record<string, ComponentCompositionMeta> = {
  "stat-card": {
    id: "stat-card",
    visualWeight: 1,
    surfaceWeight: 1,
    recommendedMinWidth: 180,
    preferredContexts: ["simple-dashboard", "analytics-dashboard", "erp-workbench", "billing-workspace"],
    avoidContexts: ["auth-screen", "settings-workspace"],
  },
  "area-chart": {
    id: "area-chart",
    visualWeight: 3,
    surfaceWeight: 1,
    recommendedMinWidth: 320,
    preferredContexts: ["simple-dashboard", "analytics-dashboard", "erp-workbench"],
    avoidContexts: ["auth-screen", "settings-workspace"],
  },
  "bar-chart": {
    id: "bar-chart",
    visualWeight: 3,
    surfaceWeight: 1,
    recommendedMinWidth: 320,
    preferredContexts: ["simple-dashboard", "analytics-dashboard"],
    avoidContexts: ["auth-screen"],
  },
  "data-table": {
    id: "data-table",
    visualWeight: 5,
    surfaceWeight: 1,
    recommendedMinWidth: 480,
    preferredContexts: ["simple-dashboard", "analytics-dashboard", "erp-workbench"],
    avoidContexts: ["auth-screen"],
  },
  "geo-breakdown": {
    id: "geo-breakdown",
    visualWeight: 5,
    surfaceWeight: 1,
    recommendedMinWidth: 640,
    preferredContexts: ["analytics-dashboard", "erp-workbench"],
    avoidContexts: ["auth-screen", "simple-dashboard", "settings-workspace"],
  },
  "line-item-matrix": {
    id: "line-item-matrix",
    visualWeight: 5,
    surfaceWeight: 1,
    recommendedMinWidth: 520,
    preferredContexts: ["erp-workbench"],
    avoidContexts: ["auth-screen", "simple-dashboard"],
  },
  "approval-workflow": {
    id: "approval-workflow",
    visualWeight: 4,
    surfaceWeight: 1,
    recommendedMinWidth: 320,
    preferredContexts: ["erp-workbench", "ai-agent-console"],
    avoidContexts: ["auth-screen", "simple-dashboard"],
  },
  "streaming-message": {
    id: "streaming-message",
    visualWeight: 2,
    surfaceWeight: 1,
    recommendedMinWidth: 300,
    preferredContexts: ["ai-chat", "ai-agent-console"],
    avoidContexts: ["auth-screen", "erp-workbench"],
  },
  "tool-call-card": {
    id: "tool-call-card",
    visualWeight: 2,
    surfaceWeight: 1,
    recommendedMinWidth: 280,
    preferredContexts: ["ai-agent-console", "ai-chat"],
    avoidContexts: ["auth-screen"],
  },
  "prompt-composer": {
    id: "prompt-composer",
    visualWeight: 3,
    surfaceWeight: 1,
    recommendedMinWidth: 320,
    preferredContexts: ["ai-chat", "ai-agent-console"],
    avoidContexts: ["auth-screen"],
  },
};

export interface CompositionSpec {
  archetype: ScreenArchetype;
  density: SpatialDensity;
  modules: Array<{ componentId: string; instances: number; containerWidth?: number }>;
  primaryActions?: number;
}

export interface CompositionValidationResult {
  score: number;
  passed: boolean;
  warnings: string[];
  errors: string[];
  totalVisualWeight: number;
  totalModules: number;
}

export function analyzePromptArchetype(prompt: string): ScreenArchetype {
  const p = prompt.toLowerCase();
  if (/login|sign[- ]?in|sign[- ]?up|otp|mfa/.test(p)) return "auth-screen";
  if (/agent|tool call|run timeline|orchestrat/.test(p)) return "ai-agent-console";
  if (/chat|copilot|assistant|streaming/.test(p)) return "ai-chat";
  if (/supply chain|purchase order|\bpo\b|three[- ]?way|ledger|erp|procurement|inventory/.test(p)) {
    return "erp-workbench";
  }
  if (/billing|subscription|invoice|plan/.test(p)) return "billing-workspace";
  if (/settings|preferences|profile|rbac|permissions/.test(p)) return "settings-workspace";
  if (/analytics|telemetry|geo|cohort|funnel/.test(p)) return "analytics-dashboard";
  return "simple-dashboard";
}

export function validateComposition(spec: CompositionSpec): CompositionValidationResult {
  const budget = ARCHETYPE_BUDGETS[spec.archetype];
  const warnings: string[] = [];
  const errors: string[] = [];

  let totalModules = 0;
  let totalVisualWeight = 0;
  let statCards = 0;
  let charts = 0;

  for (const mod of spec.modules) {
    totalModules += mod.instances;
    const meta = COMPONENT_COMPOSITION_META[mod.componentId];
    if (meta) {
      totalVisualWeight += meta.visualWeight * mod.instances;
      if (meta.avoidContexts.includes(spec.archetype)) {
        warnings.push(`ZL009: "${mod.componentId}" is discouraged inside "${spec.archetype}".`);
      }
      if (mod.containerWidth !== undefined && mod.containerWidth < meta.recommendedMinWidth) {
        errors.push(
          `ZL017: "${mod.componentId}" rendered at ${mod.containerWidth}px (< ${meta.recommendedMinWidth}px minWidth).`
        );
      }
    } else {
      totalVisualWeight += 2 * mod.instances;
    }
    if (mod.componentId === "stat-card") statCards += mod.instances;
    if (mod.componentId.includes("chart")) charts += mod.instances;
  }

  if (totalModules > budget.maxContentModules) {
    warnings.push(
      `ZL009: ${totalModules} content modules exceeds ${spec.archetype} budget (${budget.maxContentModules}).`
    );
  }
  if (statCards > budget.maxStatCards) {
    warnings.push(`ZL009: ${statCards} StatCards exceeds recommended limit (${budget.maxStatCards}).`);
  }
  if (charts > budget.maxCharts) {
    warnings.push(`ZL013: ${charts} charts exceeds recommended limit (${budget.maxCharts}).`);
  }
  if ((spec.primaryActions ?? 1) > budget.maxPrimaryActions) {
    warnings.push(`ZL008: Multiple competing primary actions (${spec.primaryActions}). Keep 1 primary CTA.`);
  }

  const score = Math.max(0, 100 - errors.length * 15 - warnings.length * 5);
  return {
    score,
    passed: errors.length === 0 && score >= 85,
    warnings,
    errors,
    totalVisualWeight,
    totalModules,
  };
}
