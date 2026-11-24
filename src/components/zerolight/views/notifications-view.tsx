"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  BellOff,
  ShieldAlert,
  Terminal,
  CreditCard,
  CheckCircle2,
  Users,
  Zap,
  Filter,
  CheckCheck,
  Settings,
  ArrowUpRight,
  Clock,
  Sparkles,
  Search,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Switch } from "../atoms/switch";
import { Avatar } from "../atoms/avatar";

export interface NotificationItem {
  id: string;
  category: "security" | "mcp" | "billing" | "deployment" | "team";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  actor?: { name: string; initials: string };
  severity: "healthy" | "critical" | "syncing" | "degraded";
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "security",
    title: "Enforced SOC2 Two-Factor Authentication on 3 Admin Accounts",
    description: "Automated cryptographic access policy triggered 2FA enrollment for s.connor@acme.inc and 2 others.",
    timestamp: "8 minutes ago",
    read: false,
    severity: "critical",
    actionLabel: "Audit Security Policy",
    actionUrl: "#security",
  },
  {
    id: "notif-2",
    category: "mcp",
    title: "MCP Stdio Server 'antigravity-mcp' Auto-Reconnected",
    description: "JSON-RPC 2.0 handshake succeeded with 18 registered design system tools available for agent interaction.",
    timestamp: "24 minutes ago",
    read: false,
    severity: "healthy",
    actionLabel: "Inspect MCP Endpoints",
    actionUrl: "#mcp",
  },
  {
    id: "notif-3",
    category: "deployment",
    title: "ZeroLight v2.4 Production Rollout Complete",
    description: "Edge worker pool scaled to 14 global regions. YIQ contrast and spring motion tokens validated with 100% test passing.",
    timestamp: "1 hour ago",
    read: false,
    severity: "healthy",
    actionLabel: "View Release Notes",
    actionUrl: "#deploy",
  },
  {
    id: "notif-4",
    category: "billing",
    title: "Monthly Enterprise License Invoice Issued (INV-9042)",
    description: "Invoice of $8,450.00 generated for 48 active seats with automatic card routing on file.",
    timestamp: "3 hours ago",
    read: true,
    severity: "healthy",
    actionLabel: "Download PDF",
    actionUrl: "#billing",
  },
  {
    id: "notif-5",
    category: "team",
    title: "Marcus Vance Accepted Invitation to ZeroLight Org",
    description: "Joined as Lead DevOps Architect with read-write access to deployment telemetry and design token presets.",
    timestamp: "Yesterday, 4:15 PM",
    read: true,
    actor: { name: "Marcus Vance", initials: "MV" },
    severity: "syncing",
    actionLabel: "View Member Profile",
    actionUrl: "#team",
  },
  {
    id: "notif-6",
    category: "security",
    title: "API Token Rotation Warning (Live Key Expires in 7 Days)",
    description: "Production key 'zl_live_8f93e2b1' requires cryptographic rotation to maintain SOC2 compliance baseline.",
    timestamp: "Nov 15, 2:30 PM",
    read: true,
    severity: "degraded",
    actionLabel: "Rotate API Key",
    actionUrl: "#keys",
  },
];

export function NotificationsView() {
  const { tokens, scaled } = useZeroLight();
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Preference switches
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      const matchUnread = !unreadOnly || !item.read;
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchUnread && matchQuery;
    });
  }, [notifications, categoryFilter, unreadOnly, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderCategoryIcon = (cat: NotificationItem["category"]) => {
    const iconProps = {
      size: scaled.iconSmSize || 15,
      strokeWidth: tokens.iconStrokeWidth || 1.75,
      color: tokens.iconColor || "currentColor",
    };
    switch (cat) {
      case "security":
        return <ShieldAlert {...iconProps} className="text-rose-600" />;
      case "mcp":
        return <Terminal {...iconProps} className="text-violet-600" />;
      case "billing":
        return <CreditCard {...iconProps} className="text-amber-600" />;
      case "deployment":
        return <CheckCircle2 {...iconProps} className="text-emerald-600" />;
      case "team":
        return <Users {...iconProps} className="text-sky-600" />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  return (
    <div
      className="w-full flex-1 flex flex-col space-y-4 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── HEADER BANNER ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border shadow-2xs"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
              style={{
                backgroundColor: tokens.primaryButtonColor,
                color: scaled.primaryActionTextColor,
              }}
            >
              <Bell size={18} strokeWidth={tokens.iconStrokeWidth || 2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-lg font-bold tracking-tight"
                  style={{
                    fontFamily: scaled.resolvedHeadingFontFamily,
                    color: tokens.textIconColor,
                  }}
                >
                  Notification &amp; Incident Center
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="critical" size="sm">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-75">
                Real-time operational alerts, SOC2 compliance telemetry, MCP server events, and invoice notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<CheckCheck className="w-3.5 h-3.5" strokeWidth={tokens.iconStrokeWidth || 1.75} />}
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconLeft={<SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={tokens.iconStrokeWidth || 1.75} />}
            onClick={() => setQuickSettingsOpen((v) => !v)}
          >
            Preferences
          </Button>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Trash2 className="w-3.5 h-3.5 text-rose-500" strokeWidth={tokens.iconStrokeWidth || 1.75} />}
              onClick={clearAll}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* ── PREFERENCES COLLAPSIBLE CARD ── */}
      {quickSettingsOpen && (
        <div
          className="p-4 border shadow-xs space-y-3 animate-in fade-in duration-150"
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${scaled.scaledCardRadius}px`,
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: tokens.universalBorderColor }}>
            <div className="flex items-center gap-2">
              <Settings size={15} strokeWidth={tokens.iconStrokeWidth || 1.75} />
              <span className="text-xs font-bold">Delivery Channel Routing</span>
            </div>
            <span className="text-[11px] opacity-60">SOC2 Verified Rule Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="p-3 border flex items-center justify-between gap-2"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
            >
              <div>
                <div className="text-xs font-semibold">Weekly Executive Digest</div>
                <div className="text-[10px] opacity-60">Summarized PDF every Monday</div>
              </div>
              <Switch checked={emailDigest} onChange={setEmailDigest} />
            </div>

            <div
              className="p-3 border flex items-center justify-between gap-2"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
            >
              <div>
                <div className="text-xs font-semibold">Slack #alerts Webhook</div>
                <div className="text-[10px] opacity-60">Instant bot event streaming</div>
              </div>
              <Switch checked={slackAlerts} onChange={setSlackAlerts} />
            </div>

            <div
              className="p-3 border flex items-center justify-between gap-2"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
            >
              <div>
                <div className="text-xs font-semibold">Critical Incident SMS</div>
                <div className="text-[10px] opacity-60">Tier-1 P0 infrastructure outages</div>
              </div>
              <Switch checked={criticalSms} onChange={setCriticalSms} />
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER TABS & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-1 p-1 border shadow-2xs overflow-x-auto max-w-full"
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${scaled.scaledRadius}px`,
          }}
        >
          {[
            { id: "all", label: "All Feeds", count: notifications.length },
            { id: "security", label: "Security & Auth", count: notifications.filter((n) => n.category === "security").length },
            { id: "mcp", label: "MCP & Tools", count: notifications.filter((n) => n.category === "mcp").length },
            { id: "deployment", label: "Deployments", count: notifications.filter((n) => n.category === "deployment").length },
            { id: "billing", label: "Billing & Tier", count: notifications.filter((n) => n.category === "billing").length },
            { id: "team", label: "Team Members", count: notifications.filter((n) => n.category === "team").length },
          ].map((tab) => {
            const isSel = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSel ? "font-bold shadow-xs" : "opacity-80 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isSel ? tokens.primaryButtonColor : "transparent",
                  color: isSel ? scaled.primaryActionTextColor : tokens.textIconColor,
                  borderRadius: `${scaled.scaledRadius}px`,
                }}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-sans tabular-nums opacity-75">({tab.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search
              size={13}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="pl-8 pr-3 py-1 text-xs border focus:outline-none w-48 sm:w-56"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => setUnreadOnly((v) => !v)}
            className={`px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              unreadOnly ? "font-bold shadow-xs" : "opacity-80 hover:opacity-100"
            }`}
            style={{
              backgroundColor: unreadOnly ? tokens.hoverBackplateTint : tokens.universalFillColor,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              borderRadius: `${scaled.scaledRadius}px`,
              color: tokens.textIconColor,
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${unreadOnly ? "bg-emerald-500" : "bg-neutral-300"}`}
            />
            <span>Unread Only</span>
          </button>
        </div>
      </div>

      {/* ── NOTIFICATIONS STREAM LIST ── */}
      <div
        className="flex-1 overflow-hidden border shadow-xs divide-y"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center border shadow-2xs"
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
              }}
            >
              <BellOff size={22} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-50" />
            </div>
            <div>
              <h3 className="text-sm font-bold">No Notifications Found</h3>
              <p className="text-xs opacity-60 mt-0.5">
                {unreadOnly
                  ? "You have acknowledged all active notifications."
                  : "All operational and telemetry feeds are completely quiet."}
              </p>
            </div>
            {unreadOnly && (
              <Button variant="outline" size="sm" onClick={() => setUnreadOnly(false)}>
                Show All Feeds
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: tokens.universalBorderColor }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className="p-4 sm:p-4.5 transition-colors cursor-pointer flex items-start justify-between gap-4 group"
                style={{
                  backgroundColor: !item.read ? tokens.hoverBackplateTint : "transparent",
                }}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Category Symbol Badge */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs mt-0.5"
                    style={{
                      backgroundColor: tokens.universalFillColor,
                      borderColor: tokens.universalBorderColor,
                      borderRadius: `${scaled.scaledRadius}px`,
                    }}
                  >
                    {renderCategoryIcon(item.category)}
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-bold leading-tight"
                        style={{
                          color: tokens.textIconColor,
                          fontFamily: scaled.resolvedHeadingFontFamily,
                        }}
                      >
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Unread" />
                      )}
                      <Badge variant={item.severity} size="xs">
                        {item.category.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs opacity-75 leading-relaxed pr-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] opacity-60 font-sans tabular-nums">
                      <span className="flex items-center gap-1">
                        <Clock size={11} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                        <span>{item.timestamp}</span>
                      </span>

                      {item.actor && (
                        <span>• By {item.actor.name}</span>
                      )}

                      {item.actionLabel && (
                        <span
                          className="font-bold underline hover:opacity-100 flex items-center gap-0.5 cursor-pointer"
                          style={{ color: tokens.primaryButtonColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Navigating to ${item.actionLabel}`);
                          }}
                        >
                          <span>{item.actionLabel}</span>
                          <ArrowUpRight size={11} strokeWidth={tokens.iconStrokeWidth || 2} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Quick Actions */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleRead(item.id)}
                    className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-xs"
                    title={item.read ? "Mark as unread" : "Mark as read"}
                  >
                    <CheckCheck size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="p-1 rounded opacity-40 hover:opacity-100 hover:text-rose-600 transition-opacity cursor-pointer text-xs"
                    title="Dismiss notification"
                  >
                    <Trash2 size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
