"use client";

import React from "react";
import { ZeroLightCoreSpecStage } from "./zerolight-core-spec-stage";
import { UnifiedEnterpriseStage } from "./unified-enterprise-stage";
import { MetricDeckSample } from "./samples/metric-deck-sample";
import { CustomerCrmSample } from "./samples/customer-crm-sample";
import { AiPlaygroundSample } from "./samples/ai-playground-sample";
import { ProjectTrackerSample } from "./samples/project-tracker-sample";
import { SettingsHubSample } from "./samples/settings-hub-sample";
import { HeroShowcase } from "../molecules/hero-showcase";
import { BentoShowcase } from "../organisms/bento-showcase";

export type SaasTemplateKey =
  | "zerolight_core"
  | "hero_showcase"
  | "bento_grid"
  | "unified_enterprise"
  | "metric_deck"
  | "customer_crm"
  | "ai_playground"
  | "project_tracker"
  | "settings_hub";

export interface SaasTemplateStageProps {
  activeTemplate?: SaasTemplateKey;
  onTemplateChange?: (key: SaasTemplateKey) => void;
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
  className?: string;
}

export function SaasTemplateStage({
  activeTemplate = "zerolight_core",
  brandName,
  brandMark,
  brandLogoUrl,
  selectedIconMark,
  className = "",
}: SaasTemplateStageProps) {
  const renderTemplateContent = () => {
    switch (activeTemplate) {
      case "hero_showcase":
        return (
          <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-12">
            <div className="text-center space-y-2 pb-6 border-b border-slate-200">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-block">
                Stageshow &bull; Animated SaaS Hero Engine
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Scripted Micro-Interactions with Real Primitives
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Choreographed 4-beat loop with window chrome, shallow cursor arcs, and rolling digits.
              </p>
            </div>
            <HeroShowcase />
            <BentoShowcase />
          </div>
        );
      case "bento_grid":
        return (
          <div className="w-full max-w-5xl mx-auto px-6 py-8">
            <BentoShowcase />
          </div>
        );
      case "unified_enterprise":
        return (
          <UnifiedEnterpriseStage
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "metric_deck":
        return (
          <MetricDeckSample
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "customer_crm":
        return (
          <CustomerCrmSample
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "ai_playground":
        return (
          <AiPlaygroundSample
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "project_tracker":
        return (
          <ProjectTrackerSample
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "settings_hub":
        return (
          <SettingsHubSample
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
      case "zerolight_core":
      default:
        return (
          <ZeroLightCoreSpecStage
            brandName={brandName}
            brandMark={brandMark}
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
          />
        );
    }
  };

  return (
    <div className={`flex-1 flex flex-col min-w-0 font-sans select-none print:block print:h-auto print:overflow-visible ${className}`}>
      <div className="flex-1 min-h-0 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-300 print:overflow-visible print:h-auto">
        {renderTemplateContent()}
      </div>
    </div>
  );
}
