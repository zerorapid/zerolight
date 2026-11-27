"use client";

import React, { useState, useMemo } from "react";
import { Compass, Layers, ShieldCheck, Copy, Check } from "lucide-react";
import { useZeroLight } from "../context";
import { architectProduct } from "../product-dna";
import { analyzePromptArchetype, ARCHETYPE_BUDGETS, validateComposition } from "../composition-engine";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export interface ProductArchitectStudioProps {
  defaultPrompt?: string;
  className?: string;
}

/**
 * Interactive ZeroLight Product DNA & Composition Budget Planner:
 * Converts a natural-language product prompt into Archetype, Entities, Routes,
 * State Machines, and validated Composition Budget.
 */
export function ProductArchitectStudio({
  defaultPrompt = "Build a real estate CRM SaaS with lead management and deal pipeline",
  className = "",
}: ProductArchitectStudioProps) {
  const { tokens, scaled } = useZeroLight();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [copied, setCopied] = useState(false);

  const dna = useMemo(() => architectProduct(prompt), [prompt]);
  const screenArchetype = useMemo(() => analyzePromptArchetype(prompt), [prompt]);
  const budget = ARCHETYPE_BUDGETS[screenArchetype];
  const validation = useMemo(
    () =>
      validateComposition({
        archetype: screenArchetype,
        density: budget.defaultDensity,
        modules: dna.recommendedComponents.map((id) => ({
          componentId: id,
          instances: id === "stat-card" ? Math.min(4, budget.maxStatCards || 1) : 1,
        })),
        primaryActions: 1,
      }),
    [screenArchetype, budget, dna]
  );

  const installCmd = `npx zerolight add ${dna.recommendedBlocks[0] || dna.recommendedComponents.join(" ")}`;

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`p-5 space-y-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 opacity-75" />
          <h3 className="text-sm font-bold">ZeroLight Product Architect</h3>
          <Badge variant="healthy" size="xs">Score {validation.score}/100</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(installCmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? "Copied CLI" : "Copy Install CLI"}
        </Button>
      </div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your SaaS product..."
        style={{
          backgroundColor: tokens.hoverBackplateTint,
          borderColor: tokens.universalBorderColor,
          borderRadius: `${scaled.scaledRadius}px`,
        }}
        className="w-full px-3 py-2 text-xs border focus:outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }} className="p-3 border space-y-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <Layers className="w-3.5 h-3.5 opacity-70" />
            <span>Product DNA</span>
          </div>
          <div><span className="opacity-60">Archetype:</span> <span className="font-semibold">{dna.name}</span></div>
          <div><span className="opacity-60">Navigation:</span> <span className="font-semibold">{dna.navigationModel}</span></div>
          <div><span className="opacity-60">Personas:</span> {dna.personas.join(", ")}</div>
        </div>

        <div style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }} className="p-3 border space-y-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
            <span>Composition Budget</span>
          </div>
          <div><span className="opacity-60">Screen:</span> <span className="font-semibold">{screenArchetype}</span></div>
          <div><span className="opacity-60">Max Modules:</span> <span className="font-sans tabular-nums font-semibold">{budget.maxContentModules}</span></div>
          <div><span className="opacity-60">Density:</span> <span className="font-semibold">{budget.defaultDensity}</span></div>
        </div>

        <div style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }} className="p-3 border space-y-2">
          <div className="font-semibold">Routes & Entities</div>
          <div className="opacity-80">{dna.entities.map((e) => e.name).join(" · ")}</div>
          <div className="text-[11px] opacity-65 font-mono truncate">
            {dna.routes.map((r) => r.path).join("  ")}
          </div>
        </div>
      </div>
    </div>
  );
}
