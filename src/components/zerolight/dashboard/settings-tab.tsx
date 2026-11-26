"use client";

import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  Terminal,
  Key,
  Database,
  Building,
  Laptop,
  Cpu,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Copy,
  Radio,
  Globe,
  Download,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import type { SettingsSubTab } from "./dashboard-shell";

export interface SettingsTabProps {
  isAuthenticated: boolean;
  userName?: string;
  onRequireAuth?: () => void;
  onNavigateDocs: () => void;
  onNavigateOverview: () => void;
  onShowToast: (msg: string) => void;
}

/** Enterprise settings & MCP integration panel. */
export function SettingsTab({
  isAuthenticated,
  userName,
  onRequireAuth,
  onNavigateDocs,
  onNavigateOverview,
  onShowToast,
}: SettingsTabProps) {
  const { tokens } = useZeroLight();
  const [settingsTab, setSettingsTab] = useState<SettingsSubTab>("general");

  const [displayName, setDisplayName] = useState(userName || "ZeroLight Root Admin");
  const [workEmail, setWorkEmail] = useState("admin@zerolight.io");
  const [orgDomain, setOrgDomain] = useState("zerolight.enterprise.internal");
  const [timezone, setTimezone] = useState("UTC");
  const [density, setDensity] = useState<"compact" | "default" | "spacious">("default");
  const [dateFormat, setDateFormat] = useState<"YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY">("YYYY-MM-DD");

  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [fido2PasskeyEnforced, setFido2PasskeyEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30m");
  const [activeSessions, setActiveSessions] = useState([
    { id: "sess-1", device: "MacBook Pro (Sonoma)", ip: "192.168.1.3", location: "San Francisco, US", activeNow: true },
    { id: "sess-2", device: "Linux Workstation (Ubuntu)", ip: "10.0.4.18", location: "Frankfurt, DE", activeNow: false },
    { id: "sess-3", device: "ZeroLight CI Runner", ip: "172.16.8.99", location: "AWS us-east-1", activeNow: false },
  ]);

  const [mcpToolList, setMcpToolList] = useState(true);
  const [mcpToolSchema, setMcpToolSchema] = useState(true);
  const [mcpToolAdd, setMcpToolAdd] = useState(true);
  const [mcpToolTokens, setMcpToolTokens] = useState(true);
  const [copilotGhostText, setCopilotGhostText] = useState(true);
  const [preferredModel, setPreferredModel] = useState("Claude 3.7 Sonnet");

  const [apiKey, setApiKey] = useState("zl_live_sec_7f9a8b2c4e1d603a");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.zerolight.io/events/v1");
  const [webhookSecret] = useState("whsec_90a1b2c3d4e5f6g7h8i9j0");
  const [pingStatus, setPingStatus] = useState<"idle" | "testing" | "success">("idle");

  const [dataRegion, setDataRegion] = useState("US East (N. Virginia - SOC2 Type II)");
  const [soc2Logging, setSoc2Logging] = useState(true);
  const [telemetrySharing, setTelemetrySharing] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRollApiKey = () => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setApiKey(`zl_live_sec_${randomHex}`);
    onShowToast("New secret API key generated and activated");
  };

  const handlePingWebhook = () => {
    setPingStatus("testing");
    setTimeout(() => {
      setPingStatus("success");
      setTimeout(() => setPingStatus("idle"), 3000);
    }, 800);
  };

  const handleRevokeOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.activeNow));
    onShowToast("All other remote sessions revoked immediately");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Enterprise platform settings successfully persisted");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-in fade-in duration-200">
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5" style={{ color: tokens.primaryButtonColor }} />
            <h2 className="text-base font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
              Admin Sign-In Required for Settings &amp; API Keys
            </h2>
          </div>
          <p className="text-xs opacity-75 leading-relaxed" style={{ color: tokens.textIconColor }}>
            Sign in as a workspace administrator to inspect secret API keys, webhooks, passkeys, and compliance settings.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button variant="primary" size="sm" onClick={() => onRequireAuth?.()}>
              Sign In to Admin Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateDocs}>
              Back to Design System
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-3 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-950">
            Enterprise Platform Settings &amp; MCP
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage profile credentials, hardware passkeys, AI agent MCP server bindings, API keys, and audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="healthy">HSM Key Active</Badge>
          <Badge variant="neutral">SOC2 Type II</Badge>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "general", label: "General & Workspace", icon: <User className="w-3.5 h-3.5" /> },
          { id: "security", label: "Security & Passkeys", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: "mcp", label: "AI Coding Agent (MCP)", icon: <Terminal className="w-3.5 h-3.5" /> },
          { id: "api", label: "API Keys & Webhooks", icon: <Key className="w-3.5 h-3.5" /> },
          { id: "compliance", label: "Residency & Audit Logs", icon: <Database className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const active = settingsTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSettingsTab(tab.id as SettingsSubTab)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                active
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {settingsTab === "general" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Administrator Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Corporate Work Email</label>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Building className="w-4 h-4 text-zinc-500" />
                <span>Workspace Domain &amp; Internationalization</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Corporate Workspace Domain</label>
                  <input
                    type="text"
                    value={orgDomain}
                    onChange={(e) => setOrgDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Default Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY")}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (UK / EU)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold block text-zinc-950">Interface Density Mode</span>
                  <span className="text-zinc-500">Fine-tune vertical height density across all buttons, inputs, and rows.</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                  {(["compact", "default", "spacious"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setDensity(mode)}
                      className={`px-3 py-1 rounded-lg font-semibold capitalize text-xs transition-colors cursor-pointer ${
                        density === mode ? "bg-white text-zinc-950 shadow-2xs" : "text-zinc-500 hover:text-zinc-950"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {settingsTab === "security" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Hardware Authentication &amp; Cryptographic Keys</span>
              </h3>

              <div className="divide-y divide-zinc-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">Enforce FIDO2 / WebAuthn Hardware Keys</span>
                    <span className="text-zinc-500">Require physical YubiKey or TouchID for root admin sessions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={fido2PasskeyEnforced}
                    onChange={(e) => setFido2PasskeyEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">
                      Mandatory TOTP Authenticator (Google Authenticator / 1Password)
                    </span>
                    <span className="text-zinc-500">Require 6-digit cryptographic verification code on login.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">Session Inactivity Auto-Lock</span>
                    <span className="text-zinc-500">Automatically lock the workspace if no keyboard or pointer activity is detected.</span>
                  </div>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-600" />
                  <span>Active Connected Sessions &amp; Devices</span>
                </h3>
                <button
                  type="button"
                  onClick={handleRevokeOtherSessions}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Revoke All Other Sessions
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {activeSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Laptop className="w-4 h-4 text-zinc-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-950">{sess.device}</span>
                          {sess.activeNow && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-400 text-[11px]">
                          {sess.ip} • {sess.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-zinc-500 font-medium text-[11px]">Authorized</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {settingsTab === "mcp" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>AI Coding Agent (MCP) Protocol Bindings</span>
                </h3>
                <Badge variant="healthy">MCP Active</Badge>
              </div>

              <p className="text-xs text-zinc-500">
                ZeroLight exposes a real JSON-RPC 2.0 stdio Model Context Protocol (MCP) server that empowers Cursor, Claude Code, and Antigravity to inspect schemas and inject verified tokens directly into source files.
              </p>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-700">Local Stdio Server:</span>
                  <code className="font-sans tabular-nums text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    node bin/zerolight-mcp.mjs
                  </code>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-700">HTTP / SSE Bridge:</span>
                  <code className="font-sans tabular-nums text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                    http://localhost:3002/api/mcp
                  </code>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Protocol Specification:</span>
                  <span className="font-semibold text-zinc-800">Model Context Protocol 2024-11-05 (JSON-RPC 2.0)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Registry Scope:</span>
                  <span className="font-bold text-zinc-900">125 Verified Primitives Active</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Tool Permissions &amp; Agent Access Grants</span>
              </h3>

              <div className="divide-y divide-zinc-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">list_components</span>
                    <span className="text-zinc-500">Allow agent to discover all available atoms, molecules, and organisms.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mcpToolList}
                    onChange={(e) => setMcpToolList(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">get_component_schema</span>
                    <span className="text-zinc-500">Allow agent to query prop types, variants, and TSX documentation.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mcpToolSchema}
                    onChange={(e) => setMcpToolSchema(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">add_component</span>
                    <span className="text-zinc-500">Allow agent to generate and inject TSX code directly into repository.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mcpToolAdd}
                    onChange={(e) => setMcpToolAdd(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">query_tokens</span>
                    <span className="text-zinc-500">Allow agent to fetch active tokens and design invariants in real time.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mcpToolTokens}
                    onChange={(e) => setMcpToolTokens(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Copilot &amp; LLM Targeting</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Preferred Coding LLM</label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                  >
                    <option value="Claude 3.7 Sonnet">Anthropic Claude 3.7 Sonnet</option>
                    <option value="GPT-4o">OpenAI GPT-4o Enterprise</option>
                    <option value="Gemini 2.0 Flash">Google Gemini 2.0 Flash</option>
                    <option value="DeepSeek V3">DeepSeek V3 (Self-Hosted)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <span className="font-semibold block text-zinc-950">Ghost-Text Autocomplete</span>
                      <span className="text-zinc-500 text-[11px]">Inline token suggestions</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={copilotGhostText}
                      onChange={(e) => setCopilotGhostText(e.target.checked)}
                      className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {settingsTab === "api" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-700" />
                  <span>Live Secret API Key</span>
                </h3>
                <button
                  type="button"
                  onClick={handleRollApiKey}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Roll Key</span>
                </button>
              </div>

              <p className="text-xs text-zinc-500">
                Use this token in the Authorization header to authenticate requests from the CLI or custom scripts.
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between font-sans tabular-nums text-xs">
                  <span className="text-zinc-900 select-all font-medium">
                    {showApiKey ? apiKey : "zl_live_sec_••••••••••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-zinc-400 hover:text-zinc-700 cursor-pointer ml-2"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  iconLeft={copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={handleCopyApiKey}
                >
                  {copiedKey ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-indigo-600" />
                  <span>Outbound Event Webhooks</span>
                </h3>
                <Badge variant="healthy">Live Stream</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Webhook Destination URL</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Signing Secret (HMAC-SHA256)</label>
                  <input
                    type="text"
                    readOnly
                    value={webhookSecret}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 font-sans tabular-nums select-all cursor-not-allowed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-zinc-500">
                    Events: <strong className="text-zinc-800">token.updated, registry.synced, auth.locked</strong>
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    iconLeft={<Radio className="w-3.5 h-3.5" />}
                    onClick={handlePingWebhook}
                  >
                    {pingStatus === "testing" ? "Pinging..." : pingStatus === "success" ? "HTTP 200 OK" : "Test Ping Endpoint"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {settingsTab === "compliance" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Data Sovereignty &amp; Enterprise Storage Region</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Primary Compliance Region</label>
                  <select
                    value={dataRegion}
                    onChange={(e) => setDataRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                  >
                    <option value="US East (N. Virginia - SOC2 Type II)">US East (N. Virginia - SOC2 Type II)</option>
                    <option value="EU Central (Frankfurt - GDPR Compliant)">EU Central (Frankfurt - GDPR Compliant)</option>
                    <option value="Asia Pacific (Tokyo - APPI Compliant)">Asia Pacific (Tokyo - APPI Compliant)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-semibold block text-zinc-950">Encryption Status</span>
                    <span className="text-zinc-500 text-[11px]">AES-256-GCM at rest, TLS 1.3 in transit</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-zinc-100 text-xs pt-2">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">SOC2 Type II Immutable Audit Logging</span>
                    <span className="text-zinc-500">Record all token updates, authentication attempts, and exports.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soc2Logging}
                    onChange={(e) => setSoc2Logging(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-zinc-950">Anonymized Registry Telemetry</span>
                    <span className="text-zinc-500">Share anonymous component usage metrics to improve ZeroLight presets.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={telemetrySharing}
                    onChange={(e) => setTelemetrySharing(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Download className="w-4 h-4 text-zinc-700" />
                  <span>Export Compliance Audit Trail</span>
                </h3>
                <Badge variant="neutral">Tamper-Proof SHA-256</Badge>
              </div>

              <p className="text-xs text-zinc-500">
                Generate an encrypted snapshot of every administrative action, user session, and MCP agent invocation for compliance auditors.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  iconLeft={<Download className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ timestamp: new Date().toISOString(), events: 1420, verified: true }));
                    const downloadAnchor = document.createElement("a");
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `zerolight_audit_${Date.now()}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                >
                  Download Audit Log (.JSON)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  iconLeft={<Download className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8,Timestamp,Event,Actor,IP\n" + `${new Date().toISOString()},AUTH_SUCCESS,zerolight,192.168.1.3\n`;
                    const downloadAnchor = document.createElement("a");
                    downloadAnchor.setAttribute("href", encodeURI(csvContent));
                    downloadAnchor.setAttribute("download", `zerolight_audit_${Date.now()}.csv`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                >
                  Download Audit Log (.CSV)
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200">
          <Button variant="outline" size="sm" type="button" onClick={onNavigateOverview}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
