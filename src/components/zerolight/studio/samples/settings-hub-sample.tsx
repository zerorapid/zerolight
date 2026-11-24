"use client";

import React, { useState } from "react";
import {
  Building2,
  Palette,
  Cpu,
  Bell,
  ShieldCheck,
  CreditCard,
  Check,
  Save,
  Globe2,
  Clock,
  Mail,
  Key,
  Lock,
  Server,
  Zap,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  RotateCw,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { Button } from "../../atoms/button";
import { Badge } from "../../atoms/badge";
import { Switch } from "../../atoms/switch";
import { BrandLogoRenderer } from "./brand-logo-renderer";
import { CornerRadiusPreset, HeightDensityPreset } from "../../types";

export type SettingsHubTabKey = "general" | "appearance" | "mcp" | "notifications" | "security" | "billing";

export interface SettingsHubSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

interface McpServerItem {
  id: string;
  name: string;
  transport: "stdio" | "sse";
  endpoint: string;
  status: "connected" | "syncing" | "idle";
  toolsCount: number;
  lastPing: string;
}

const DEFAULT_MCP_SERVERS: McpServerItem[] = [
  {
    id: "mcp-1",
    name: "antigravity-mcp",
    transport: "stdio",
    endpoint: "bin/zerolight-mcp.mjs",
    status: "connected",
    toolsCount: 18,
    lastPing: "12ms",
  },
  {
    id: "mcp-2",
    name: "stitch-mcp-design",
    transport: "sse",
    endpoint: "http://localhost:3001/mcp",
    status: "connected",
    toolsCount: 14,
    lastPing: "28ms",
  },
  {
    id: "mcp-3",
    name: "postgres-enterprise-db",
    transport: "stdio",
    endpoint: "npx -y @modelcontextprotocol/server-postgres",
    status: "connected",
    toolsCount: 8,
    lastPing: "45ms",
  },
  {
    id: "mcp-4",
    name: "github-ci-telemetry",
    transport: "stdio",
    endpoint: "npx -y @modelcontextprotocol/server-github",
    status: "idle",
    toolsCount: 12,
    lastPing: "110ms",
  },
];

export function SettingsHubSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: SettingsHubSampleProps) {
  const { tokens, updateTokens, scaled } = useZeroLight();
  const [activeTab, setActiveTab] = useState<SettingsHubTabKey>("general");
  const [selectedPlan, setSelectedPlan] = useState<"team" | "enterprise">("enterprise");

  // General Form states
  const [orgName, setOrgName] = useState(`${brandName} Systems Inc`);
  const [domainPrefix, setDomainPrefix] = useState(brandName.toLowerCase().replace(/\s+/g, ""));
  const [adminEmail, setAdminEmail] = useState(`security@${brandName.toLowerCase().replace(/\s+/g, "")}.io`);
  const [timezone, setTimezone] = useState("UTC (GMT+0:00)");
  const [language, setLanguage] = useState("English (US)");

  // Notification states
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);
  const [browserPush, setBrowserPush] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  // Security states
  const [twoFactor, setTwoFactor] = useState(true);
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  // MCP state
  const [mcpServers, setMcpServers] = useState<McpServerItem[]>(DEFAULT_MCP_SERVERS);
  const [newMcpName, setNewMcpName] = useState("");
  const [newMcpEndpoint, setNewMcpEndpoint] = useState("");
  const [showAddMcp, setShowAddMcp] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddMcpServer = () => {
    if (!newMcpName.trim()) return;
    const item: McpServerItem = {
      id: `mcp-${Date.now()}`,
      name: newMcpName.trim(),
      transport: "stdio",
      endpoint: newMcpEndpoint.trim() || "npx -y @mcp/server",
      status: "connected",
      toolsCount: 6,
      lastPing: "32ms",
    };
    setMcpServers((prev) => [...prev, item]);
    setNewMcpName("");
    setNewMcpEndpoint("");
    setShowAddMcp(false);
  };

  const removeMcpServer = (id: string) => {
    setMcpServers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText("zl_sec_live_94f8a201c87e");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const iconProps = {
    size: scaled.iconSmSize || 14,
    strokeWidth: tokens.iconStrokeWidth || 1.75,
    color: tokens.iconColor || "currentColor",
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row gap-5 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── LEFT VERTICAL SUB-NAVIGATION ── */}
      <div
        className="w-full md:w-56 shrink-0 p-2.5 flex flex-col space-y-1 border"
        style={{
          backgroundColor: tokens.hoverBackplateTint,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
        }}
      >
        <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider px-2 py-1">
          Settings Console
        </span>

        {[
          { id: "general", label: "General & Identity", icon: Building2 },
          { id: "appearance", label: "Appearance & Theme", icon: Palette },
          { id: "mcp", label: "MCP Protocol Servers", icon: Cpu, badge: `${mcpServers.length}` },
          { id: "notifications", label: "Alerts & Feeds", icon: Bell },
          { id: "security", label: "Security & SAML", icon: ShieldCheck },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
        ].map((item) => {
          const isSel = activeTab === item.id;
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as SettingsHubTabKey)}
              className={`w-full text-left px-2.5 py-2 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isSel ? "shadow-2xs font-bold" : "opacity-75 hover:opacity-100"
              }`}
              style={{
                backgroundColor: isSel ? tokens.universalFillColor : "transparent",
                borderColor: isSel ? tokens.universalBorderColor : "transparent",
                borderWidth: isSel ? `${tokens.borderWidth}px` : "0px",
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            >
              <div className="flex items-center gap-2">
                <IconComp {...iconProps} className={isSel ? "opacity-100" : "opacity-60"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className="text-[10px] font-sans tabular-nums px-1.5 py-0.2 rounded-full font-bold"
                  style={{
                    backgroundColor: isSel ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                    color: isSel ? scaled.primaryActionTextColor : tokens.textIconColor,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── RIGHT MAIN SETTINGS FORM PANE ── */}
      <div
        className="flex-1 p-5 space-y-5 border"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: tokens.universalBorderColor }}
        >
          <div className="space-y-0.5">
            <h3
              className="text-sm font-bold flex items-center gap-2"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              {activeTab === "general" && "Organization Legal Identity & Domain"}
              {activeTab === "appearance" && "Appearance, Polarity & Token Styling"}
              {activeTab === "mcp" && "Model Context Protocol (MCP) Endpoints"}
              {activeTab === "notifications" && "Delivery Routing & Alerts Preferences"}
              {activeTab === "security" && "Two-Factor Authentication, SSO & Keys"}
              {activeTab === "billing" && "Subscription Tiers, Seats & Invoices"}
            </h3>
            <p className="text-xs opacity-75">
              Live configuration test-bench. Modulating tokens dynamically recalculates form borders and control focus halos.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            iconLeft={savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            {savedSuccess ? "Saved" : "Save Changes"}
          </Button>
        </div>

        {/* ── TAB 1: GENERAL & IDENTITY ── */}
        {activeTab === "general" && (
          <div className="space-y-4 max-w-xl">
            {/* Brand Logo & Identity Preview */}
            <div
              className="flex items-center gap-3 p-3 border shadow-2xs"
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
            >
              <BrandLogoRenderer
                brandLogoUrl={brandLogoUrl}
                selectedIconMark={selectedIconMark}
                brandMark={brandMark}
                size="md"
              />
              <div>
                <div className="text-xs font-bold" style={{ color: tokens.textIconColor }}>
                  {brandName}
                </div>
                <div className="text-[11px] opacity-60">Verified Primary Workspace Brand Identity</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold block flex items-center gap-1.5">
                <Building2 {...iconProps} className="opacity-60" />
                <span>Organization Legal Business Name</span>
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border focus:outline-none"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderRadius: `${scaled.scaledRadius}px`,
                  color: tokens.textIconColor,
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold block flex items-center gap-1.5">
                <Globe2 {...iconProps} className="opacity-60" />
                <span>Workspace URL Slug</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={domainPrefix}
                  onChange={(e) => setDomainPrefix(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border-y border-l focus:outline-none"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    borderTopLeftRadius: `${scaled.scaledRadius}px`,
                    borderBottomLeftRadius: `${scaled.scaledRadius}px`,
                    color: tokens.textIconColor,
                  }}
                />
                <span
                  className="px-3 py-1.5 text-xs border font-sans tabular-nums opacity-60 shrink-0"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    borderTopRightRadius: `${scaled.scaledRadius}px`,
                    borderBottomRightRadius: `${scaled.scaledRadius}px`,
                  }}
                >
                  .zerolight.io
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold block flex items-center gap-1.5">
                  <Clock {...iconProps} className="opacity-60" />
                  <span>Timezone</span>
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border focus:outline-none"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    borderRadius: `${scaled.scaledRadius}px`,
                    color: tokens.textIconColor,
                  }}
                >
                  <option>UTC (GMT+0:00)</option>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Asia/Kolkata (IST)</option>
                  <option>Europe/London (BST)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold block flex items-center gap-1.5">
                  <Mail {...iconProps} className="opacity-60" />
                  <span>Administrative Security Email</span>
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border focus:outline-none"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    borderRadius: `${scaled.scaledRadius}px`,
                    color: tokens.textIconColor,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: APPEARANCE & THEME ── */}
        {activeTab === "appearance" && (
          <div className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold block flex items-center gap-1.5">
                <Palette {...iconProps} className="opacity-60" />
                <span>Surface Polarity &amp; Fill</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { hex: "#FFFFFF", label: "Pure White", desc: "Default Light" },
                  { hex: "#F8F9FA", label: "Stage Slate", desc: "Subtle Gray" },
                  { hex: "#0F172A", label: "Obsidian Ink", desc: "Dark Mode" },
                ].map((th) => {
                  const isMatch = (tokens.universalFillColor || "#FFFFFF").toUpperCase() === th.hex.toUpperCase();
                  return (
                    <button
                      key={th.hex}
                      type="button"
                      onClick={() => updateTokens?.({ universalFillColor: th.hex })}
                      className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                        isMatch ? "ring-2 ring-slate-900 shadow-xs" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: th.hex,
                        borderColor: tokens.universalBorderColor,
                        color: th.hex === "#0F172A" ? "#F8FAFC" : "#0F172A",
                      }}
                    >
                      <div className="text-xs font-bold">{th.label}</div>
                      <div className="text-[10px] opacity-75">{th.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold block flex items-center gap-1.5">
                <Layers {...iconProps} className="opacity-60" />
                <span>Corner Geometry Preset</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { r: 0, label: "Sharp (0px)" },
                  { r: 8, label: "Subtle (8px)" },
                  { r: 16, label: "Rounded (16px)" },
                  { r: 24, label: "Soft (24px)" },
                ].map((cr) => {
                  const isMatch = tokens.cornerRadius === cr.r;
                  return (
                    <button
                      key={cr.r}
                      type="button"
                      onClick={() => updateTokens?.({ cornerRadius: cr.r as CornerRadiusPreset })}
                      className={`p-2.5 text-center border text-xs font-semibold transition-all cursor-pointer ${
                        isMatch ? "font-bold shadow-2xs" : "opacity-75 hover:opacity-100"
                      }`}
                      style={{
                        borderRadius: `${cr.r}px`,
                        backgroundColor: isMatch ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                        color: isMatch ? scaled.primaryActionTextColor : tokens.textIconColor,
                        borderColor: tokens.universalBorderColor,
                      }}
                    >
                      {cr.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold block flex items-center gap-1.5">
                <Sliders {...iconProps} className="opacity-60" />
                <span>UI Height Density</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { d: 36, label: "Compact (36px)", desc: "Dense enterprise tables" },
                  { d: 44, label: "Default (44px)", desc: "Balanced modern SaaS" },
                  { d: 52, label: "Spacious (52px)", desc: "Relaxed touch targets" },
                ].map((item) => {
                  const isMatch = (tokens.heightDensity || 44) === item.d;
                  return (
                    <button
                      key={item.d}
                      type="button"
                      onClick={() => updateTokens?.({ heightDensity: item.d as HeightDensityPreset })}
                      className={`p-2.5 text-left border rounded-xl transition-all cursor-pointer ${
                        isMatch ? "font-bold shadow-2xs" : "opacity-75 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isMatch ? tokens.hoverBackplateTint : "transparent",
                        borderColor: isMatch ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] opacity-60">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: MCP PROTOCOL SERVERS ── */}
        {activeTab === "mcp" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Cpu {...iconProps} className="text-violet-600" />
                  <span>Model Context Protocol (JSON-RPC 2.0 Stdio &amp; SSE)</span>
                </h4>
                <p className="text-[11px] opacity-60">Connected tooling agents and autonomous sidecars.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddMcp((v) => !v)}
              >
                Add MCP Server
              </Button>
            </div>

            {showAddMcp && (
              <div
                className="p-3.5 border rounded-xl space-y-3 shadow-2xs animate-in fade-in"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                }}
              >
                <div className="text-xs font-bold">Register New MCP Server Endpoint</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMcpName}
                    onChange={(e) => setNewMcpName(e.target.value)}
                    placeholder="e.g. cloudflare-mcp"
                    className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    value={newMcpEndpoint}
                    onChange={(e) => setNewMcpEndpoint(e.target.value)}
                    placeholder="e.g. npx -y @cloudflare/mcp"
                    className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAddMcp(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleAddMcpServer}>
                    Connect Server
                  </Button>
                </div>
              </div>
            )}

            <div className="divide-y border rounded-xl overflow-hidden shadow-2xs" style={{ borderColor: tokens.universalBorderColor }}>
              {mcpServers.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors"
                  style={{ backgroundColor: tokens.universalFillColor }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                      }}
                    >
                      <Terminal size={15} strokeWidth={tokens.iconStrokeWidth || 1.75} className="text-violet-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{srv.name}</span>
                        <Badge variant={srv.status === "connected" ? "healthy" : "neutral"} size="xs">
                          {srv.status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-sans tabular-nums opacity-60">
                          {srv.transport.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] opacity-60 font-sans tabular-nums mt-0.5 truncate max-w-md">
                        {srv.endpoint} • Ping: {srv.lastPing}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="neutral" size="sm" className="font-sans tabular-nums">
                      {srv.toolsCount} Tools Active
                    </Badge>
                    <button
                      type="button"
                      onClick={() => removeMcpServer(srv.id)}
                      className="p-1 opacity-40 hover:opacity-100 hover:text-rose-600 transition-opacity cursor-pointer"
                      title="Disconnect MCP Server"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: ALERTS & FEEDS ── */}
        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-xl">
            <div className="space-y-3">
              {[
                {
                  id: "digest",
                  title: "Weekly Telemetry Digest",
                  desc: "Comprehensive PDF report with token telemetry and SOC2 event feed sent every Monday.",
                  icon: Mail,
                  val: emailDigest,
                  set: setEmailDigest,
                },
                {
                  id: "slack",
                  title: "Slack Incident Webhook",
                  desc: "Post real-time bot alerts to designated enterprise Slack channels for P0 outages.",
                  icon: Zap,
                  val: slackAlerts,
                  set: setSlackAlerts,
                },
                {
                  id: "sms",
                  title: "Critical P0 SMS Escalation",
                  desc: "Send SMS dispatch directly to on-call platform engineers during degraded telemetry.",
                  icon: AlertCircle,
                  val: criticalSms,
                  set: setCriticalSms,
                },
                {
                  id: "push",
                  title: "In-Browser Push Banners",
                  desc: "Display floating notifications when agent builds or registry compiles complete.",
                  icon: Bell,
                  val: browserPush,
                  set: setBrowserPush,
                },
                {
                  id: "quiet",
                  title: "Automated Quiet Hours (10 PM - 7 AM)",
                  desc: "Mute non-critical notification sounds and queue digests for morning dispatch.",
                  icon: Clock,
                  val: quietHours,
                  set: setQuietHours,
                },
              ].map((item) => {
                const IconC = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-3 border flex items-center justify-between gap-3 shadow-2xs"
                    style={{
                      backgroundColor: tokens.hoverBackplateTint,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      borderRadius: `${scaled.scaledRadius}px`,
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <IconC {...iconProps} className="mt-0.5 opacity-60" />
                      <div>
                        <div className="text-xs font-bold">{item.title}</div>
                        <div className="text-[11px] opacity-60 leading-snug">{item.desc}</div>
                      </div>
                    </div>
                    <Switch checked={item.val} onChange={item.set} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 5: SECURITY & SAML ── */}
        {activeTab === "security" && (
          <div className="space-y-4 max-w-xl">
            <div className="space-y-3">
              <div
                className="p-3 border flex items-center justify-between gap-3 shadow-2xs"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderRadius: `${scaled.scaledRadius}px`,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <ShieldCheck {...iconProps} className="mt-0.5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold">Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] opacity-60">Require TOTP or FIDO2 WebAuthn keys for all members.</div>
                  </div>
                </div>
                <Switch checked={twoFactor} onChange={setTwoFactor} />
              </div>

              <div
                className="p-3 border flex items-center justify-between gap-3 shadow-2xs"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderRadius: `${scaled.scaledRadius}px`,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <Lock {...iconProps} className="mt-0.5 opacity-60" />
                  <div>
                    <div className="text-xs font-bold">SAML 2.0 / Okta SSO Enforcement</div>
                    <div className="text-[11px] opacity-60">Enforce IdP authentication with automatic SCIM deprovisioning.</div>
                  </div>
                </div>
                <Switch checked={ssoEnforced} onChange={setSsoEnforced} />
              </div>

              {/* API Key Box */}
              <div
                className="p-3.5 border space-y-2 rounded-xl shadow-2xs"
                style={{
                  backgroundColor: tokens.universalFillColor,
                  borderColor: tokens.universalBorderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key {...iconProps} className="text-amber-600" />
                    <span className="text-xs font-bold">Production API Secret Key</span>
                  </div>
                  <Badge variant="healthy" size="xs">ACTIVE</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="zl_sec_live_94f8a201c87e"
                    className="w-full px-3 py-1.5 text-xs font-sans tabular-nums border rounded-lg bg-neutral-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={apiKeyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    onClick={handleCopyApiKey}
                  >
                    {apiKeyCopied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<RotateCw className="w-3.5 h-3.5" />}
                    onClick={() => alert("Rotating key...")}
                  >
                    Rotate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: BILLING & PLANS ── */}
        {activeTab === "billing" && (
          <div className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "team",
                  name: "Team Plan",
                  price: "$29 / seat",
                  features: ["Up to 20 seats", "Standard MCP Stdio", "Community support"],
                },
                {
                  id: "enterprise",
                  name: "Enterprise Pro",
                  price: "$79 / seat",
                  features: ["Unlimited seats", "Distributed MCP SSE", "SOC2 compliance & audit log"],
                },
              ].map((tier) => {
                const isMatch = selectedPlan === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedPlan(tier.id as "team" | "enterprise")}
                    className={`p-4 border rounded-xl space-y-2 cursor-pointer transition-all ${
                      isMatch ? "ring-2 shadow-xs" : "opacity-75 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: isMatch ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      backgroundColor: isMatch ? tokens.hoverBackplateTint : tokens.universalFillColor,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{tier.name}</span>
                      {isMatch && <Badge variant="healthy" size="xs">ACTIVE</Badge>}
                    </div>
                    <div className="text-base font-extrabold font-sans tabular-nums">{tier.price}</div>
                    <ul className="space-y-1 text-[11px] opacity-75 pt-1">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check size={11} className="text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Seats Progress Bar */}
            <div
              className="p-3.5 border rounded-xl space-y-2 shadow-2xs"
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
              }}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Active Seat Allocation</span>
                <span className="font-sans tabular-nums">42 / 50 seats used (84%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: "84%",
                    backgroundColor: tokens.primaryButtonColor,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
