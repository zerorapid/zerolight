"use client";

import React from "react";
import { Download, Layers, Plus, RefreshCw, Sparkles } from "lucide-react";
import { ZeroLightTokens, ScaledTokens } from "../types";
import { Badge, Button, Switch } from "../atoms";
import {
  AreaChart,
  BarChart,
  ChatInput,
  DateRangePicker,
  DonutChart,
  FunnelChart,
  SearchBar,
  SegmentedControl,
  StatCard,
} from "../molecules";
import { ChatConversation } from "../organisms";
import {
  AnalyticsReportTemplate,
  ChatWorkspaceTemplate,
  ConsoleTableTemplate,
  DashboardTemplate,
  SettingsFormTemplate,
} from "../templates";

export type StudioTemplateTab = "dashboard" | "console" | "settings" | "analytics" | "chat";

export interface TemplatesShowcaseProps {
  activeTemplateTab: StudioTemplateTab;
  setActiveTemplateTab: React.Dispatch<React.SetStateAction<StudioTemplateTab>>;
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  cardStyle: React.CSSProperties;
  triggerToast: (msg: string) => void;
}

export function TemplatesShowcase({
  activeTemplateTab,
  setActiveTemplateTab,
  tokens,
  scaled,
  cardStyle,
  triggerToast,
}: TemplatesShowcaseProps) {
  return (
              <div className="space-y-6">
                {/* Header Banner & Template Sub-Switcher */}
                <div style={cardStyle} className="p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Layers size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                          Atomic Tier 4: Reusable Layout Templates
                        </h2>
                        <Badge variant="healthy">5 Layout Blueprints</Badge>
                      </div>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed max-w-2xl">
                        Clean architectural skeletons combining organisms, molecules, and anti-crowding rules. Fully reactive to Visual Studio design tokens.
                      </p>
                    </div>
                  </div>

                  {/* Template Selector Pill Tabs - Single Line, Never Wraps */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                    }}
                    className="flex items-center gap-1.5 p-1 border shadow-xs overflow-x-auto whitespace-nowrap scrollbar-none"
                  >
                    {[
                      { id: "dashboard", label: "Dashboard", code: "DashboardTemplate", desc: "3-Zone Telemetry Cockpit" },
                      { id: "console", label: "Console Table", code: "ConsoleTableTemplate", desc: "Fleet & Entity Console" },
                      { id: "settings", label: "Settings Form", code: "SettingsFormTemplate", desc: "Multi-tab Form Hub" },
                      { id: "analytics", label: "Analytics Report", code: "AnalyticsReportTemplate", desc: "DateRange KPI Report" },
                      { id: "chat", label: "AI Workspace", code: "ChatWorkspaceTemplate", desc: "3-Pane AI Copilot" },
                    ].map((tpl) => {
                      const isSelected = activeTemplateTab === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setActiveTemplateTab(tpl.id as any)}
                          style={{
                            backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                            color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            transition: "all 0.2s ease",
                          }}
                          className={`px-4 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                            isSelected ? "shadow-xs" : "hover:text-neutral-900"
                          }`}
                        >
                          <span>{tpl.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Template Context Bar */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5 px-1">
                    <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded border border-neutral-200/60 tabular-nums">
                      &lt;{[
                        { id: "dashboard", code: "DashboardTemplate" },
                        { id: "console", code: "ConsoleTableTemplate" },
                        { id: "settings", code: "SettingsFormTemplate" },
                        { id: "analytics", code: "AnalyticsReportTemplate" },
                        { id: "chat", code: "ChatWorkspaceTemplate" },
                      ].find(t => t.id === activeTemplateTab)?.code} /&gt;
                    </span>
                    <span className="text-neutral-500 text-xs hidden sm:inline">
                      {[
                        { id: "dashboard", desc: "3-Zone Telemetry Cockpit combining KPI deck, real-time splines, and orchestration event tables." },
                        { id: "console", desc: "Fleet & entity management console with unified search, tab filters, and full-width data table." },
                        { id: "settings", desc: "Enterprise preferences hub with multi-tab navigation and sticky unsaved changes bar." },
                        { id: "analytics", desc: "DateRange KPI report with dynamic period filters, spline scrubbing crosshair, and multi-tier composite matrix." },
                        { id: "chat", desc: "3-pane enterprise AI copilot with session history rail, active conversation thread, and inspector drawer." },
                      ].find(t => t.id === activeTemplateTab)?.desc}
                    </span>
                  </div>
                </div>

                {/* Template 1: DashboardTemplate */}
                {activeTemplateTab === "dashboard" && (
                  <div style={cardStyle} className="p-0 border shadow-sm overflow-hidden rounded-xl">
                    <DashboardTemplate
                      title="Executive Infrastructure Cockpit"
                      subtitle="Live health index, error budget burns, throughput splines and cluster nodes."
                      statusIndicator={
                        <Badge variant="healthy">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Cluster Live • 99.98% SLA</span>
                          </span>
                        </Badge>
                      }
                      primaryAction={
                        <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />} onClick={() => triggerToast("Provisioning cluster...")}>
                          Deploy Cluster
                        </Button>
                      }
                      secondaryActions={
                        <Button variant="outline" size="sm" iconLeft={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => triggerToast("Telemetry refreshed")}>
                          Sync
                        </Button>
                      }
                      metrics={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                          <StatCard label="TOTAL WORKLOADS" value="1,248" delta="+12 today" trend="up" comparisonText="across 8 zones" />
                          <StatCard label="P99 LATENCY" value="18.4 ms" delta="-4.2 ms" trend="down" comparisonText="vs 24h baseline" />
                          <StatCard label="ERROR BUDGET" value="99.94%" delta="nominal" trend="neutral" comparisonText="0 incidents" />
                          <StatCard label="ACTIVE NODES" value="84 / 96" delta="87.5% load" trend="up" comparisonText="12 reserve" />
                        </div>
                      }
                      primaryWidget={
                        <AreaChart
                          title="Throughput Spline"
                          subtitle="Interactive scrub curve"
                          data={[
                            { label: "00:00", value: 1400 },
                            { label: "04:00", value: 1800 },
                            { label: "08:00", value: 3200 },
                            { label: "12:00", value: 4600 },
                            { label: "16:00", value: 4100 },
                            { label: "20:00", value: 2800 },
                            { label: "24:00", value: 1900 },
                          ]}
                          valueFormatter={(v) => `${v.toLocaleString()} req/s`}
                        />
                      }
                      secondaryWidget={
                        <DonutChart
                          title="Node Quota Split"
                          subtitle="Resource consumption"
                          data={[
                            { id: "1", label: "Compute Pods", value: 55, color: scaled.chartColors[0] },
                            { id: "2", label: "Postgres Storage", value: 30, color: scaled.chartColors[1] },
                            { id: "3", label: "Edge Gateway", value: 15, color: scaled.chartColors[2] },
                          ]}
                        />
                      }
                      dataSection={
                        <div style={cardStyle} className="p-4 border">
                          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                            <span className="font-semibold text-sm text-neutral-900">Recent Orchestration Events</span>
                            <Badge variant="neutral">Auto-reconciliation active</Badge>
                          </div>
                          <div className="divide-y divide-neutral-100 text-xs">
                            {[
                              { event: "Auto-scaled ingress-gateway replica set to 8 nodes", time: "2 mins ago", status: "Completed" },
                              { event: "Rotated mutual TLS leaf certificate on us-east-01", time: "18 mins ago", status: "Verified" },
                              { event: "Database read replica sync completed (0.4s lag)", time: "1 hour ago", status: "Healthy" },
                            ].map((row, i) => (
                              <div key={i} className="py-2.5 flex items-center justify-between">
                                <span className="font-medium text-neutral-700">{row.event}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-neutral-400 tabular-nums">{row.time}</span>
                                  <Badge variant="healthy">{row.status}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}

                {/* Template 2: ConsoleTableTemplate */}
                {activeTemplateTab === "console" && (
                  <div style={cardStyle} className="p-0 border shadow-sm overflow-hidden rounded-xl">
                    <ConsoleTableTemplate
                      breadcrumbs={
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span>Infrastructure</span>
                          <span>/</span>
                          <span className="font-semibold text-neutral-900">Virtual Fleet</span>
                        </div>
                      }
                      title="Compute Nodes Fleet"
                      subtitle="Provisioned virtual machines, memory quotas, and active health checks."
                      badge={<Badge variant="healthy">24 Nodes Active</Badge>}
                      primaryAction={
                        <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />} onClick={() => triggerToast("Provisioning node...")}>
                          Add Node
                        </Button>
                      }
                      secondaryActions={
                        <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />} onClick={() => triggerToast("Exporting CSV...")}>
                          Export
                        </Button>
                      }
                      toolbar={
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                          <SearchBar placeholder="Search nodes by hostname or IP..." value="" onChange={() => {}} className="w-full sm:w-72" />
                          <SegmentedControl
                            options={[
                              { key: "all", label: "All Nodes", count: 24 },
                              { key: "us", label: "US Regions", count: 16 },
                              { key: "eu", label: "EU Regions", count: 8 },
                            ]}
                            value="all"
                            onChange={() => {}}
                          />
                        </div>
                      }
                      table={
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-neutral-200/70 bg-neutral-50/50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Hostname</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Region</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">CPU Load</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {[
                                { host: "node-us-east-01.acme.net", region: "us-east-1", cpu: "28%", status: "healthy" as const },
                                { host: "node-us-west-02.acme.net", region: "us-west-2", cpu: "64%", status: "healthy" as const },
                                { host: "node-eu-west-01.acme.net", region: "eu-west-1", cpu: "14%", status: "healthy" as const },
                                { host: "node-ap-south-01.acme.net", region: "ap-south-1", cpu: "89%", status: "warning" as const },
                              ].map((node) => (
                                <tr key={node.host} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0 text-xs">
                                  <td className="py-3 px-4 font-semibold text-neutral-900">{node.host}</td>
                                  <td className="py-3 px-4 text-neutral-500">{node.region}</td>
                                  <td className="py-3 px-4 tabular-nums font-medium">{node.cpu}</td>
                                  <td className="py-3 px-4">
                                    <Badge variant={node.status === "healthy" ? "healthy" : "critical"}>
                                      {node.status}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => triggerToast(`Inspecting ${node.host}`)}>
                                      Details →
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      }
                    />
                  </div>
                )}

                {/* Template 3: SettingsFormTemplate */}
                {activeTemplateTab === "settings" && (
                  <div style={cardStyle} className="p-0 border shadow-sm overflow-hidden rounded-xl">
                    <SettingsFormTemplate
                      title="Workspace Security & Access"
                      subtitle="Manage team authentication, API rate limits, and compliance settings."
                      tabs={[
                        { id: "auth", label: "Authentication" },
                        { id: "members", label: "Team Roles" },
                        { id: "notifications", label: "Alerts" },
                      ]}
                      activeTabId="auth"
                      onTabChange={(tab) => triggerToast(`Switched to ${tab} tab`)}
                      isDirty={false}
                      onSave={() => triggerToast("Changes saved")}
                      onDiscard={() => triggerToast("Changes reverted")}
                    >
                      <div className="space-y-6">
                        <div style={cardStyle} className="p-5 border space-y-4">
                          <h3 className="text-sm font-bold text-neutral-900">Single Sign-On (SSO)</h3>
                          <p className="text-xs text-neutral-500">Enforce SAML 2.0 or Okta identity provider authentication.</p>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <span className="text-xs font-semibold text-neutral-800 block">Require SAML SSO</span>
                              <span className="text-[11px] text-neutral-400">Password login will be disabled for team members.</span>
                            </div>
                            <Switch checked={true} onChange={() => triggerToast("SSO toggle switched")} />
                          </div>
                        </div>

                        <div style={cardStyle} className="p-5 border space-y-4">
                          <h3 className="text-sm font-bold text-neutral-900">Two-Factor Authentication (2FA)</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-neutral-800 block">Enforce 2FA Organization-Wide</span>
                              <span className="text-[11px] text-neutral-400">Members must enroll a TOTP authenticator app.</span>
                            </div>
                            <Switch checked={true} onChange={() => triggerToast("2FA toggle switched")} />
                          </div>
                        </div>
                      </div>
                    </SettingsFormTemplate>
                  </div>
                )}

                {/* Template 4: AnalyticsReportTemplate */}
                {activeTemplateTab === "analytics" && (
                  <div style={cardStyle} className="p-0 border shadow-sm overflow-hidden rounded-xl">
                    <AnalyticsReportTemplate
                      title="Quarterly Infrastructure Telemetry"
                      subtitle="Consolidated compute, storage and bandwidth report."
                      dateRangeFilter={
                        <DateRangePicker
                          onChange={(range) => triggerToast(`Selected: ${range.startDate} – ${range.endDate}`)}
                        />
                      }
                      exportAction={
                        <Button variant="secondary" size="sm" onClick={() => triggerToast("Exporting Analytics PDF...")}>
                          Export PDF
                        </Button>
                      }
                      kpiCards={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                          <StatCard label="GROSS INGRESS" value="1.42 TB" delta="+18%" trend="up" comparisonText="vs Q3" />
                          <StatCard label="AVG RESPONSE" value="14.2 ms" delta="-2.1 ms" trend="down" comparisonText="healthy" />
                          <StatCard label="PEAK CONCURRENCY" value="48.2k" delta="+34%" trend="up" comparisonText="record peak" />
                          <StatCard label="CLOUD SPEND" value="$14,280" delta="-5.4%" trend="down" comparisonText="under budget" />
                        </div>
                      }
                      heroChart={
                        <AreaChart
                          title="Traffic Distribution (Spline)"
                          subtitle="Multi-zone ingress telemetry"
                          data={[
                            { label: "Week 1", value: 240, secondaryValue: 180 },
                            { label: "Week 2", value: 380, secondaryValue: 260 },
                            { label: "Week 3", value: 420, secondaryValue: 310 },
                            { label: "Week 4", value: 560, secondaryValue: 390 },
                          ]}
                          primaryLabel="Q4 2026"
                          secondaryLabel="Q3 2026"
                          valueFormatter={(v) => `${v}k req`}
                        />
                      }
                      compositeGrid={
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch w-full">
                          <BarChart
                            title="Resource Burn"
                            subtitle="Compute vs Storage allocation"
                            data={[
                              { label: "Oct", value: 4200, secondaryValue: 2800 },
                              { label: "Nov", value: 5100, secondaryValue: 3400 },
                              { label: "Dec", value: 4800, secondaryValue: 3100 },
                            ]}
                            primaryLabel="Compute"
                            secondaryLabel="Storage"
                            valueFormatter={(v) => `$${v}`}
                          />
                          <DonutChart
                            title="Global Cloud Ingress"
                            subtitle="Traffic distribution by zone"
                            data={[
                              { id: "1", label: "US East (N. Virginia)", value: 48, color: scaled.chartColors[0] },
                              { id: "2", label: "EU Central (Frankfurt)", value: 32, color: scaled.chartColors[1] },
                              { id: "3", label: "AP South (Mumbai)", value: 20, color: scaled.chartColors[2] },
                            ]}
                          />
                          <FunnelChart
                            title="Deployment Verification"
                            subtitle="Stage-by-stage automated pipeline"
                            stages={[
                              { id: "1", name: "Lint & Unit", count: 1240 },
                              { id: "2", name: "E2E Integration", count: 1180 },
                              { id: "3", name: "Security Audit", count: 1120 },
                              { id: "4", name: "Production Canary", count: 1094 },
                            ]}
                          />
                        </div>
                      }
                    />
                  </div>
                )}

                {/* Template 5: ChatWorkspaceTemplate */}
                {activeTemplateTab === "chat" && (
                  <div style={cardStyle} className="p-0 border shadow-sm overflow-hidden rounded-xl">
                    <ChatWorkspaceTemplate
                      assistantTitle="ZeroLight AI Assistant"
                      modelBadge={
                        <Badge variant="healthy">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Claude 3.7 Sonnet</span>
                          </span>
                        </Badge>
                      }
                      sessions={[
                        { id: "1", title: "Cluster Failure Analysis", timestamp: "10 mins ago", isActive: true },
                        { id: "2", title: "API Gateway Rate Limit Rules", timestamp: "Yesterday", isActive: false },
                        { id: "3", title: "Database Sharding Plan", timestamp: "Nov 6", isActive: false },
                      ]}
                      onSelectSession={(id) => triggerToast(`Switched to session ${id}`)}
                      onNewSession={() => triggerToast("Created new conversation")}
                      conversationStream={
                        <ChatConversation
                          peerName="ZeroLight Assistant"
                          peerRole="DevOps AI Copilot"
                        />
                      }
                      inputArea={
                        <ChatInput
                          placeholder="Ask the AI copilot about your architecture..."
                          onSend={(msg) => triggerToast(`Dispatched: "${msg.slice(0, 30)}..."`)}
                          onAttach={() => triggerToast("File dialog triggered")}
                        />
                      }
                    />
                  </div>
                )}
              </div>
  );
}
