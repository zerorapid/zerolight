"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Blocks, Cpu, ShieldCheck } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Switch } from "../atoms/switch";
import { DynamicIcon } from "../atoms/dynamic-icon";

const B2B_BLOCKS = [
  {
    name: "Billing Portal",
    cmd: "npx zerolight add block/billing-portal",
    desc: "Stripe tiers, seat proration, payment methods & invoice ledger",
  },
  {
    name: "Multi-Tenant Kit",
    cmd: "npx zerolight add block/tenant-kit",
    desc: "Workspace switcher, isolation controls & tenant metadata",
  },
  {
    name: "Team Permissions (RBAC)",
    cmd: "npx zerolight add block/team-permissions",
    desc: "Role matrix, invite flow & granular permission toggles",
  },
  {
    name: "Geo Breakdown",
    cmd: "npx zerolight add block/geo-breakdown",
    desc: "Zero-API-key SVG WorldMap + ranked regional telemetry",
  },
  {
    name: "Enterprise DataTable",
    cmd: "npx zerolight add block/data-table",
    desc: "Virtual grid, CSV/TSV paste, column pinning & TSV export",
  },
  {
    name: "Bento Showcase",
    cmd: "npx zerolight add block/bento-showcase",
    desc: "Asymmetric SaaS Bento grid with ProductWindow & KPIs",
  },
];

const CLI_COMMANDS = [
  { cmd: "npx zerolight add button", label: "Button & Triggers" },
  { cmd: "npx zerolight add input", label: "Inputs & Fields" },
  { cmd: "npx zerolight tokens export", label: "Tailwind Tokens Export" },
  { cmd: "npx zerolight list", label: "List 125+ Registry Items" },
  { cmd: "zerolight check ./src", label: "Rust Token Invariant Audit" },
  { cmd: "zerolight diff button", label: "Check Upstream Diffs" },
];

/** Dedicated CLI, Registry, B2B Blocks, and Live Token Feed tab. */
export function CliRegistryTab() {
  const { tokens, scaled } = useZeroLight();
  const [liveInput, setLiveInput] = useState("prod-cluster@zerolight.dev");
  const [liveSwitch, setLiveSwitch] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const primColor = tokens.primaryButtonColor || "#0F172A";

  const copyCommand = (cmd: string) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-0.5 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            CLI, Registry &amp; B2B Blocks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Install token-safe ZeroLight components and full B2B enterprise blocks via CLI, shadcn <code className="font-mono text-[11px]">/r/</code> registry, or Rust CLI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="healthy">125 Registry Payloads</Badge>
          <Badge variant="neutral">shadcn /r/ Compatible</Badge>
        </div>
      </div>

      {/* Live Runtime Token Feed */}
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="p-5 border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="healthy" size="xs" showDot>Live Runtime Token Feed</Badge>
            <span className="text-[11px] font-semibold text-zinc-500 tabular-nums">
              Radius: {tokens.cornerRadius ?? 12}px &bull; Font: {tokens.fontFamily || "Plus Jakarta Sans"} &bull; Icons: {(tokens.iconLibrary || "lucide").toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Real ZeroLight atoms bound directly to live <code className="font-mono text-[11px]">useZeroLight()</code> context tokens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Input
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              placeholder="Live token input..."
            />
          </div>
          <Switch checked={liveSwitch} onChange={setLiveSwitch} />
          <div className="p-2 rounded-lg border border-zinc-200/80 flex items-center gap-1.5">
            <DynamicIcon name="shield-check" size={16} library={tokens.iconLibrary} strokeWidth={tokens.iconStrokeWidth || 1.75} color={primColor} />
            <DynamicIcon name="zap" size={16} library={tokens.iconLibrary} strokeWidth={tokens.iconStrokeWidth || 1.75} color={primColor} />
          </div>
          <Button variant="primary" size="sm">
            Primary Token CTA
          </Button>
        </div>
      </div>

      {/* 1-Command B2B Enterprise Blocks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Blocks className="w-4 h-4 text-zinc-700" />
              <span>1-Command B2B Enterprise Blocks</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Drop-in multi-component enterprise modules that go beyond basic primitives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {B2B_BLOCKS.map((block) => {
            const isCopied = copiedCmd === block.cmd;
            return (
              <div
                key={block.cmd}
                onClick={() => copyCommand(block.cmd)}
                className="p-4 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer shadow-2xs flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-950">{block.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      Block
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{block.desc}</p>
                </div>

                <div className="px-3 py-2 rounded-lg bg-zinc-950 text-emerald-400 text-[11px] font-mono flex items-center justify-between gap-2">
                  <span className="truncate">{block.cmd}</span>
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Terminal CLI & Rust Engine */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-700" />
            <span>Terminal CLI, Rust Engine &amp; MCP Registry</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Node CLI (<code className="font-mono text-[11px]">bin/cli.mjs</code>), Rust native CLI (<code className="font-mono text-[11px]">rust-cli/</code>), and JSON-RPC 2.0 MCP server.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200/80 bg-zinc-950 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-sans font-bold text-zinc-200">ZeroLight Distribution Registry</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans tabular-nums">v2.4.0 Engine Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CLI_COMMANDS.map((cli) => {
              const isCopied = copiedCmd === cli.cmd;
              return (
                <div
                  key={cli.cmd}
                  onClick={() => copyCommand(cli.cmd)}
                  className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 transition cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] text-zinc-400 mb-1">{cli.label}</div>
                    <div className="text-xs font-mono text-emerald-400 font-semibold truncate">{cli.cmd}</div>
                  </div>
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>MCP Server: <code className="text-zinc-200">node bin/zerolight-mcp.mjs</code></span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authenticated via <code className="text-zinc-200">x-zerolight-token</code></span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
