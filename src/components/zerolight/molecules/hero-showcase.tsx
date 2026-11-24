"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useZeroLight } from "../context";
import {
  ProductWindow,
  ChoreographedCursor,
  CounterRoll,
  PlaceholderLines,
} from "./product-stage";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Avatar } from "../atoms/avatar";
import { Server, Zap, CheckCircle2, ChevronDown, Sparkles, Play, Pause } from "lucide-react";

export interface HeroShowcaseProps {
  className?: string;
  autoPlay?: boolean;
}

/**
 * HeroShowcase: Production-grade, animated, looping SaaS product hero.
 * Employs Stageshow choreography invariants with REAL ZeroLight components:
 * - 4-beat scripted interaction
 * - Visible cursor causes (presses, arcs)
 * - Digit roll on the metric payoff
 * - Zero-seam loop reset
 */
export function HeroShowcase({
  className = "",
  autoPlay = true,
}: HeroShowcaseProps) {
  const { tokens, scaled } = useZeroLight();

  // Story beats: 0 = Idle, 1 = Moving to Scale Action, 2 = Dropdown Open, 3 = Scaling Complete (Payoff), 4 = Returning
  const [beat, setBeat] = useState<number>(0);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 340, y: 190 });
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);

  const containerRef = useRef<HTMLDivElement>(null);

  // Scripted Story Loop (4 beats)
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    const runScript = () => {
      // Beat 0: Initial rest state
      setBeat(0);
      setCursorPos({ x: 380, y: 190 });
      setIsPressing(false);

      // Beat 1: Cursor moves to the Scale Action Button (at 1200ms)
      timeoutId = setTimeout(() => {
        setBeat(1);
        setCursorPos({ x: 235, y: 92 });

        // Beat 1.5: Cursor presses the button (at 2000ms)
        timeoutId = setTimeout(() => {
          setIsPressing(true);

          // Beat 2: Dropdown opens (at 2250ms)
          timeoutId = setTimeout(() => {
            setIsPressing(false);
            setBeat(2);

            // Move cursor to "Autonomous Scaling Tier" (at 2600ms)
            timeoutId = setTimeout(() => {
              setCursorPos({ x: 235, y: 148 });

              // Click the tier (at 3200ms)
              timeoutId = setTimeout(() => {
                setIsPressing(true);

                // Beat 3: Payoff! Option selected, Metric rolls up, Cluster scales (at 3450ms)
                timeoutId = setTimeout(() => {
                  setIsPressing(false);
                  setBeat(3);

                  // Move cursor back to rest position (at 4200ms)
                  timeoutId = setTimeout(() => {
                    setCursorPos({ x: 380, y: 190 });

                    // Beat 4: Hold the payoff, then seamlessly loop back to Beat 0 (at 6000ms)
                    timeoutId = setTimeout(() => {
                      runScript();
                    }, 2400);
                  }, 800);
                }, 250);
              }, 600);
            }, 350);
          }, 250);
        }, 800);
      }, 1200);
    };

    runScript();

    return () => clearTimeout(timeoutId);
  }, [isPlaying]);

  const isScaled = beat >= 3;
  const isDropdownOpen = beat === 2;

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* ── THE PRODUCT WINDOW STAGE (WITH INTENTIONAL RIGHT/BOTTOM BLEED) ── */}
      <ProductWindow
        chrome="macos"
        title="ZeroLight OS — Autonomous Workload Orchestrator"
        toolbar={
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Demo" : "Play Demo"}
            className="p-1 rounded hover:bg-slate-200/60 transition-colors text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        }
        className="w-full shadow-2xl"
      >
        <div
          ref={containerRef}
          className="p-5 relative min-h-[260px] flex flex-col justify-between overflow-hidden"
          style={{
            backgroundColor: tokens.universalFillColor || "#FFFFFF",
            color: tokens.textIconColor || "#0F172A",
          }}
        >
          {/* ── TOP ACTION BAR (ZONE 1) ── */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0"
                style={{ backgroundColor: tokens.primaryButtonColor || "#0F172A" }}
              >
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 tracking-tight">
                    Prod-Cluster-East
                  </span>
                  <Badge
                    variant={isScaled ? "healthy" : "neutral"}
                    size="xs"
                    showDot
                  >
                    {isScaled ? "Auto-Scaling (P99 12ms)" : "Manual (P99 38ms)"}
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Region: us-east-1 &bull; 24 Nodes
                </span>
              </div>
            </div>

            {/* Simulated Action Trigger (Target of Beat 1) */}
            <div className="relative">
              <Button
                variant={isDropdownOpen ? "secondary" : "outline"}
                size="sm"
                iconRight={<ChevronDown className="w-3 h-3" />}
                className="text-[11px] h-7 px-2.5 shadow-2xs font-semibold"
              >
                {isScaled ? "Scaling: Autonomous" : "Scale Workload"}
              </Button>

              {/* Animated Dropdown Menu Popover (Opens during Beat 2) */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={scaled.motionConfig.spring}
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                    }}
                    className="absolute right-0 top-8 w-52 bg-white/95 backdrop-blur-md p-1 border shadow-xl z-30 space-y-0.5 text-left"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Scaling Policy
                    </div>
                    <div className="px-2 py-1.5 rounded text-[11px] text-slate-600 hover:bg-slate-100 flex items-center justify-between">
                      <span>Manual Fixed Nodes</span>
                      <span className="text-[10px] text-slate-400 font-mono">24x</span>
                    </div>
                    <div
                      className="px-2 py-1.5 rounded text-[11px] font-semibold text-slate-900 bg-slate-100 flex items-center justify-between"
                      style={{
                        backgroundColor: `${tokens.primaryButtonColor || "#0F172A"}12`,
                        color: tokens.primaryButtonColor || "#0F172A",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Autonomous Scaling</span>
                      </div>
                      <span className="text-[10px] font-bold">ACTIVE</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── METRICS PAYOFF & REAL DATA CARDS (ZONE 2) ── */}
          <div className="grid grid-cols-2 gap-3 py-3">
            {/* Real StatCard with CounterRoll Digit Roll */}
            <div
              className="p-3.5 border bg-white space-y-1 shadow-2xs"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium">Throughput Peak</span>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold tracking-tight text-slate-900">
                <CounterRoll
                  value={isScaled ? 126800 : 84200}
                  suffix=" req/s"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isScaled ? "+50.6% Efficiency Boost" : "Baseline Active"}</span>
              </div>
            </div>

            {/* Edge Zone Latency Card */}
            <div
              className="p-3.5 border bg-white space-y-1.5 shadow-2xs"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
              }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium">Active Deployment Nodes</span>
                <span className="text-[10px] font-mono text-slate-400">us-east</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center -space-x-1.5">
                  <Avatar initials="JR" size="xs" />
                  <Avatar initials="AK" size="xs" />
                  <Avatar initials="AI" size="xs" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {isScaled ? "32 Edge Replicas" : "24 Standby Replicas"}
                </span>
              </div>
              <PlaceholderLines count={2} widths={["90%", "65%"]} />
            </div>
          </div>

          {/* ── SATELLITE FOOTER (STORY BEAT STATUS) ── */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Looping Beat: {beat + 1} / 4</span>
            </div>
            <span>Powered by ZeroLight Math Physics &amp; Stageshow Architecture</span>
          </div>

          {/* ── THE CHOREOGRAPHED CURSOR (MOVES ACCORDING TO SCRIPT) ── */}
          <ChoreographedCursor
            x={cursorPos.x}
            y={cursorPos.y}
            isPressing={isPressing}
            label="Alex (DevOps)"
            avatarInitials="AD"
            avatarColor={tokens.primaryButtonColor || "#059669"}
            color={tokens.primaryButtonColor || "#0F172A"}
          />
        </div>
      </ProductWindow>
    </div>
  );
}
