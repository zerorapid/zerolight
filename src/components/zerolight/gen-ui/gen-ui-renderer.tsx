"use client";

import React from "react";
import { z } from "zod";
import { useZeroLight } from "../context";
import { StatCard } from "../molecules/stat-card";
import { AreaChart } from "../molecules/area-chart";
import { BarChart } from "../molecules/bar-chart";
import { DonutChart } from "../molecules/donut-chart";
import { AlertBanner } from "../molecules/alert-banner";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";

/**
 * Deterministic Generative UI Runtime Schemas (Vercel AI SDK / assistant-ui / AG-UI / MCP Apps compatible).
 * AI agents emit strictly typed JSON blocks; ZeroLight renders token-safe SaaS UI with zero CSS injection.
 */
export const StatGridBlockSchema = z.object({
  type: z.literal("zl.stat_grid"),
  stage: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.union([z.string(), z.number()]),
        delta: z.string().optional(),
        trend: z.enum(["up", "down", "neutral"]).optional(),
        comparisonText: z.string().optional(),
        subValue: z.string().optional(),
        timeframeLabel: z.string().optional(),
      })
    )
    .min(1)
    .max(4),
});

export const AreaChartBlockSchema = z.object({
  type: z.literal("zl.area_chart"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  primaryLabel: z.string().optional(),
  secondaryLabel: z.string().optional(),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        secondaryValue: z.number().optional(),
      })
    )
    .min(2),
});

export const BarChartBlockSchema = z.object({
  type: z.literal("zl.bar_chart"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  primaryLabel: z.string().optional(),
  secondaryLabel: z.string().optional(),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        secondaryValue: z.number().optional(),
      })
    )
    .min(1),
});

export const DonutChartBlockSchema = z.object({
  type: z.literal("zl.donut_chart"),
  title: z.string().optional(),
  centerLabel: z.string().optional(),
  data: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .min(1),
});

export const AlertBannerBlockSchema = z.object({
  type: z.literal("zl.alert_banner"),
  severity: z.enum(["info", "warning", "success", "critical"]).default("info"),
  title: z.string().min(1),
  description: z.string().optional(),
});

export const ApprovalCardBlockSchema = z.object({
  type: z.literal("zl.approval_card"),
  title: z.string().min(1),
  description: z.string().min(1),
  amount: z.string().optional(),
  riskLevel: z.enum(["Low", "Medium", "High"]).default("Medium"),
  approveLabel: z.string().default("Approve Action"),
  rejectLabel: z.string().default("Reject"),
});

export const GenUIBlockSchema = z.discriminatedUnion("type", [
  StatGridBlockSchema,
  AreaChartBlockSchema,
  BarChartBlockSchema,
  DonutChartBlockSchema,
  AlertBannerBlockSchema,
  ApprovalCardBlockSchema,
]);

export const GenUIPayloadSchema = z.object({
  blocks: z.array(GenUIBlockSchema).min(1),
});

export type GenUIBlock = z.infer<typeof GenUIBlockSchema>;
export type GenUIPayload = z.infer<typeof GenUIPayloadSchema>;

export interface ZeroLightGenUIRendererProps {
  spec: unknown;
  morphicStageOverride?: 1 | 2 | 3;
  onApprove?: (blockTitle: string) => void;
  onReject?: (blockTitle: string) => void;
  className?: string;
}

export function ZeroLightGenUIRenderer({
  spec,
  morphicStageOverride,
  onApprove,
  onReject,
  className = "",
}: ZeroLightGenUIRendererProps) {
  const { tokens, scaled } = useZeroLight();
  const parsed = GenUIPayloadSchema.safeParse(spec);

  if (!parsed.success) {
    return (
      <AlertBanner
        severity="critical"
        title="Invalid Generative UI Schema"
        description={parsed.error.issues[0]?.message || "Schema validation failed against GenUIPayloadSchema."}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {parsed.data.blocks.map((block, index) => {
        if (block.type === "zl.stat_grid") {
          const activeStage = morphicStageOverride || block.stage || 2;
          const cols =
            block.items.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]";
          return (
            <div key={index} className={`grid ${cols} gap-4`}>
              {block.items.map((item, idx) => (
                <StatCard
                  key={idx}
                  stage={activeStage}
                  label={item.label}
                  value={item.value}
                  delta={item.delta}
                  trend={item.trend}
                  comparisonText={item.comparisonText}
                  subValue={item.subValue}
                  timeframeLabel={item.timeframeLabel || (activeStage === 3 ? "30d Live" : undefined)}
                />
              ))}
            </div>
          );
        }

        if (block.type === "zl.area_chart") {
          return (
            <AreaChart
              key={index}
              title={block.title}
              subtitle={block.subtitle}
              primaryLabel={block.primaryLabel}
              secondaryLabel={block.secondaryLabel}
              data={block.data}
            />
          );
        }

        if (block.type === "zl.bar_chart") {
          return (
            <BarChart
              key={index}
              title={block.title}
              subtitle={block.subtitle}
              primaryLabel={block.primaryLabel}
              secondaryLabel={block.secondaryLabel}
              data={block.data}
            />
          );
        }

        if (block.type === "zl.donut_chart") {
          const defaultColors: string[] = [
            tokens.chartPrimaryColor || tokens.primaryButtonColor || "#0F172A",
            tokens.chartSecondaryColor || "#10B981",
            "#64748B",
            "#94A3B8",
          ];
          return (
            <DonutChart
              key={index}
              title={block.title}
              centerLabel={block.centerLabel}
              data={block.data.map((d, dIdx) => ({
                ...d,
                color: d.color || defaultColors[dIdx % defaultColors.length],
              }))}
            />
          );
        }

        if (block.type === "zl.alert_banner") {
          return (
            <AlertBanner
              key={index}
              severity={block.severity}
              title={block.title}
              description={block.description}
            />
          );
        }

        return (
          <div
            key={index}
            className="border p-5 space-y-3"
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
                {block.title}
              </span>
              <div className="flex items-center gap-2">
                {block.amount && (
                  <span className="text-sm font-bold font-sans tabular-nums" style={{ color: tokens.textIconColor }}>
                    {block.amount}
                  </span>
                )}
                <Badge variant={block.riskLevel === "High" ? "critical" : block.riskLevel === "Low" ? "healthy" : "degraded"} size="xs">
                  {block.riskLevel} Risk
                </Badge>
              </div>
            </div>
            <p className="text-xs opacity-75 leading-relaxed" style={{ color: tokens.textIconColor }}>
              {block.description}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: tokens.universalBorderColor }}>
              <Button variant="outline" size="sm" onClick={() => onReject?.(block.title)}>
                {block.rejectLabel}
              </Button>
              <Button variant="primary" size="sm" onClick={() => onApprove?.(block.title)}>
                {block.approveLabel}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
