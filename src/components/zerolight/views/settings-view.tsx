"use client";

import React, { useState } from "react";
import {
  SettingsFormTemplate,
  FormField,
  Switch,
  RadioGroup,
  TeamPermissions,
} from "@/components/zerolight";
import {
  Building2,
  Users,
  ShieldCheck,
  Bell,
} from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState("ZeroLight Technologies, Inc.");
  const [workspaceSlug, setWorkspaceSlug] = useState("zerolight-prod");
  const [supportEmail, setSupportEmail] = useState("support@zerolight.io");
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [samlEnforced, setSamlEnforced] = useState(false);
  const [defaultRole, setDefaultRole] = useState("developer");
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(false);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 1000);
  };

  const handleDiscard = () => {
    setOrgName("ZeroLight Technologies, Inc.");
    setWorkspaceSlug("zerolight-prod");
    setSupportEmail("support@zerolight.io");
    setTwoFactorRequired(true);
    setSamlEnforced(false);
    setDefaultRole("developer");
    setSlackAlerts(true);
    setEmailDigests(false);
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SettingsFormTemplate
        title="Organization & Security Controls"
        subtitle="Configure enterprise workspace domains, member access roles, SSO policies and incident alerts."
        tabs={[
          { id: "general", label: "General & Workspace", icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: "team", label: "Team & Member Roles", icon: <Users className="w-3.5 h-3.5" /> },
          { id: "security", label: "Security & SSO", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: "notifications", label: "Incident Alerts", icon: <Bell className="w-3.5 h-3.5" /> },
        ]}
        activeTabId={activeTab}
        onTabChange={(id) => setActiveTab(id)}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      >
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-neutral-200/70 rounded-xl space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-neutral-900">Organization Profile</h3>
              <p className="text-xs text-neutral-500">Legal entity name and primary domain slug for API routing.</p>
              <div className="space-y-3 pt-2">
                <FormField
                  id="org-name"
                  label="Legal Business Name"
                  value={orgName}
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    markDirty();
                  }}
                />
                <FormField
                  id="org-slug"
                  label="Workspace URL Slug"
                  value={workspaceSlug}
                  onChange={(e) => {
                    setWorkspaceSlug(e.target.value);
                    markDirty();
                  }}
                />
                <FormField
                  id="org-email"
                  label="Primary Support Email"
                  value={supportEmail}
                  onChange={(e) => {
                    setSupportEmail(e.target.value);
                    markDirty();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <TeamPermissions />
            <div className="p-6 bg-white border border-neutral-200/70 rounded-xl space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-neutral-900">Default Member Onboarding Role</h3>
              <p className="text-xs text-neutral-500">New engineers invited to this cluster inherit this default role scope.</p>
              <RadioGroup
                name="default-role"
                cardMode={true}
                value={defaultRole}
                onChange={(val) => {
                  setDefaultRole(val);
                  markDirty();
                }}
                options={[
                  {
                    value: "developer",
                    label: "Software Engineer",
                    description: "Full read/write deployment access to non-production clusters and API keys.",
                  },
                  {
                    value: "devops",
                    label: "Infrastructure Admin",
                    description: "Full cluster management, ingress routing and root billing credentials.",
                  },
                  {
                    value: "auditor",
                    label: "Compliance Auditor",
                    description: "Read-only access to audit logs, SOC-2 reports and access logs.",
                  },
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-neutral-200/70 rounded-xl space-y-5 shadow-2xs">
              <h3 className="text-sm font-bold text-neutral-900">Authentication Safeguards</h3>
              <div className="space-y-4 divide-y divide-neutral-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Enforce Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-neutral-500">All members must configure hardware keys or TOTP authenticators.</span>
                  </div>
                  <Switch
                    checked={twoFactorRequired}
                    onChange={(checked) => {
                      setTwoFactorRequired(checked);
                      markDirty();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Enforce Enterprise SAML / Okta SSO</span>
                    <span className="text-[11px] text-neutral-500">Redirect login flows through corporate Identity Provider.</span>
                  </div>
                  <Switch
                    checked={samlEnforced}
                    onChange={(checked) => {
                      setSamlEnforced(checked);
                      markDirty();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-neutral-200/70 rounded-xl space-y-5 shadow-2xs">
              <h3 className="text-sm font-bold text-neutral-900">Incident & Alert Dispatches</h3>
              <div className="space-y-4 divide-y divide-neutral-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Slack Webhook Alerts</span>
                    <span className="text-[11px] text-neutral-500">Post critical latency spikes and SLO breaches into #ops-telemetry.</span>
                  </div>
                  <Switch
                    checked={slackAlerts}
                    onChange={(checked) => {
                      setSlackAlerts(checked);
                      markDirty();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Weekly Performance Digests</span>
                    <span className="text-[11px] text-neutral-500">Email consolidated cluster throughput and bill summaries.</span>
                  </div>
                  <Switch
                    checked={emailDigests}
                    onChange={(checked) => {
                      setEmailDigests(checked);
                      markDirty();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </SettingsFormTemplate>
    </div>
  );
}
