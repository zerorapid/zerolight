"use client";

import React, { useState, useMemo } from "react";
import { useZeroLight } from "../context";
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  CreditCard,
  Server,
  Search,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Mail,
  Lock,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Modal } from "./modal";
import { z } from "zod";

export type TeamRole = "Owner" | "Admin" | "Developer" | "Billing Viewer";
export type MemberStatus = "Active" | "Pending Invite" | "Suspended";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  twoFactorEnabled: boolean;
  lastActive: string;
  avatarInitials: string;
}

export interface PermissionScope {
  id: string;
  name: string;
  description: string;
  category: "Infrastructure" | "Billing" | "API Keys" | "Governance";
  allowedRoles: TeamRole[];
}

export interface TeamPermissionsProps {
  initialMembers?: TeamMember[];
  className?: string;
  onInviteMember?: (member: Omit<TeamMember, "id" | "lastActive">) => void;
  onUpdateRole?: (memberId: string, newRole: TeamRole) => void;
  onRevokeMember?: (memberId: string) => void;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "mem-01",
    name: "Sarah Connor",
    email: "s.connor@zerolight.io",
    role: "Owner",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "Just now",
    avatarInitials: "SC",
  },
  {
    id: "mem-02",
    name: "Alex Vane",
    email: "a.vane@zerolight.io",
    role: "Admin",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "14m ago",
    avatarInitials: "AV",
  },
  {
    id: "mem-03",
    name: "Elena Rostova",
    email: "e.rostova@zerolight.io",
    role: "Developer",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "2h ago",
    avatarInitials: "ER",
  },
  {
    id: "mem-04",
    name: "Marcus Brody",
    email: "m.brody@zerolight.io",
    role: "Billing Viewer",
    status: "Active",
    twoFactorEnabled: false,
    lastActive: "1d ago",
    avatarInitials: "MB",
  },
  {
    id: "mem-05",
    name: "David Kim",
    email: "d.kim@zerolight.io",
    role: "Developer",
    status: "Pending Invite",
    twoFactorEnabled: false,
    lastActive: "Invited yesterday",
    avatarInitials: "DK",
  },
];

const PERMISSION_SCOPES: PermissionScope[] = [
  {
    id: "scope-deploy-prod",
    name: "Deploy Production Clusters",
    description: "Can promote and roll out container builds to live multi-region clusters.",
    category: "Infrastructure",
    allowedRoles: ["Owner", "Admin"],
  },
  {
    id: "scope-rollback",
    name: "Trigger Emergency Rollback",
    description: "Can revert deployments immediately to the previous healthy hash checkpoint.",
    category: "Infrastructure",
    allowedRoles: ["Owner", "Admin", "Developer"],
  },
  {
    id: "scope-keys-create",
    name: "Issue High-Privilege API Keys",
    description: "Can generate production scoped tokens with full read/write database permissions.",
    category: "API Keys",
    allowedRoles: ["Owner", "Admin"],
  },
  {
    id: "scope-keys-revoke",
    name: "Revoke Leaked Secrets",
    description: "Instant kill-switch to invalidate tokens across the global edge network.",
    category: "API Keys",
    allowedRoles: ["Owner", "Admin", "Developer"],
  },
  {
    id: "scope-billing-manage",
    name: "Manage Credit Cards & Invoices",
    description: "Access to PCI vault, tax invoice downloads, and subscription tier upgrades.",
    category: "Billing",
    allowedRoles: ["Owner", "Admin", "Billing Viewer"],
  },
  {
    id: "scope-team-rbac",
    name: "Modify RBAC & Granular Policies",
    description: "Can promote members, grant administrative rights, or enforce hardware 2FA.",
    category: "Governance",
    allowedRoles: ["Owner"],
  },
];

const InviteSchema = z.object({
  email: z.string().email("Please provide a valid corporate email address"),
  role: z.enum(["Owner", "Admin", "Developer", "Billing Viewer"]),
  message: z.string().max(200).optional(),
});

export function TeamPermissions({
  initialMembers = DEFAULT_MEMBERS,
  className = "",
  onInviteMember,
  onUpdateRole,
  onRevokeMember,
}: TeamPermissionsProps) {
  const { tokens, scaled } = useZeroLight();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "admins" | "devs" | "pending">("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(null);

  // Form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Developer");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedTab === "admins") return m.role === "Owner" || m.role === "Admin";
      if (selectedTab === "devs") return m.role === "Developer";
      if (selectedTab === "pending") return m.status === "Pending Invite";
      return true;
    });
  }, [members, searchQuery, selectedTab]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    const validation = InviteSchema.safeParse({ email: inviteEmail, role: inviteRole });
    if (!validation.success) {
      setInviteError(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    const initials = inviteEmail.substring(0, 2).toUpperCase();
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending Invite",
      twoFactorEnabled: false,
      lastActive: "Invited just now",
      avatarInitials: initials,
    };

    setMembers((prev) => [...prev, newMember]);
    if (onInviteMember) {
      onInviteMember({
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: newMember.status,
        twoFactorEnabled: newMember.twoFactorEnabled,
        avatarInitials: newMember.avatarInitials,
      });
    }

    setIsInviteModalOpen(false);
    setInviteEmail("");
    setFeedbackToast(`Invitation sent to ${newMember.email}`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleRevoke = (id: string, name: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActiveMenuMemberId(null);
    if (onRevokeMember) onRevokeMember(id);
    setFeedbackToast(`Revoked access for ${name}`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleRoleChange = (id: string, newRole: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    setActiveMenuMemberId(null);
    if (onUpdateRole) onUpdateRole(id, newRole);
    setFeedbackToast(`Updated role to ${newRole}`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Toast Feedback */}
      {feedbackToast && (
        <div
          role="status"
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            boxShadow: scaled.cardShadow,
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-neutral-900 border animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Team Members & Granular RBAC
            </h2>
            <Badge variant="healthy">
              <span>{members.length} Members Enrolled</span>
            </Badge>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Role-Based Access Control matrix with mandatory hardware 2FA enforcement and audit provenance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconLeft={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Team Member
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
          boxShadow: scaled.cardShadow,
        }}
        className="p-4 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: "all", label: "All Members", count: members.length },
              { id: "admins", label: "Admins & Owners", count: members.filter((m) => m.role === "Owner" || m.role === "Admin").length },
              { id: "devs", label: "Developers", count: members.filter((m) => m.role === "Developer").length },
              { id: "pending", label: "Pending", count: members.filter((m) => m.status === "Pending Invite").length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  selectedTab === tab.id ? "bg-neutral-800 text-neutral-200" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Filter by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 text-xs border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Members Roster Table */}
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
          boxShadow: scaled.cardShadow,
        }}
        className="border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Member</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Assigned Role</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">2FA Security</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Active</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No team members found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {member.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{member.name}</div>
                          <div className="text-[11px] text-neutral-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-neutral-800">
                        {member.role === "Owner" && <Shield className="w-3.5 h-3.5 text-amber-600" />}
                        {member.role === "Admin" && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                        {member.role === "Developer" && <Server className="w-3.5 h-3.5 text-emerald-600" />}
                        {member.role === "Billing Viewer" && <CreditCard className="w-3.5 h-3.5 text-neutral-600" />}
                        <span>{member.role}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {member.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Enforced (FIDO2)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Disabled (Warning)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          member.status === "Active"
                            ? "healthy"
                            : member.status === "Pending Invite"
                            ? "neutral"
                            : "critical"
                        }
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 font-sans tabular-nums">
                      {member.lastActive}
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveMenuMemberId(activeMenuMemberId === member.id ? null : member.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuMemberId === member.id && (
                          <div
                            style={{
                              borderRadius: `${scaled.scaledRadius}px`,
                              backgroundColor: tokens.universalFillColor,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              boxShadow: scaled.cardShadow,
                            }}
                            className="absolute right-4 mt-1 w-44 z-30 border p-1 text-xs text-left"
                          >
                            <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              Change Role
                            </div>
                            {(["Admin", "Developer", "Billing Viewer"] as TeamRole[]).map((r) => (
                              <button
                                key={r}
                                type="button"
                                disabled={member.role === r || member.role === "Owner"}
                                onClick={() => handleRoleChange(member.id, r)}
                                className={`w-full px-2 py-1 rounded text-left flex items-center justify-between cursor-pointer ${
                                  member.role === r ? "text-neutral-400 font-semibold cursor-not-allowed" : "hover:bg-neutral-100 text-neutral-700"
                                }`}
                              >
                                <span>{r}</span>
                                {member.role === r && <Check className="w-3 h-3 text-emerald-600" />}
                              </button>
                            ))}
                            <div className="my-1 border-t border-neutral-100" />
                            <button
                              type="button"
                              disabled={member.role === "Owner"}
                              onClick={() => handleRevoke(member.id, member.name)}
                              className={`w-full px-2 py-1 rounded text-left flex items-center gap-1.5 cursor-pointer ${
                                member.role === "Owner"
                                  ? "text-neutral-400 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke Access</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Granular RBAC Permission Matrix Section */}
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
          boxShadow: scaled.cardShadow,
        }}
        className="p-5 border space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Live Granular Policy Matrix</h3>
            <p className="text-xs text-neutral-500">
              Deterministic entitlement mapping enforced on every API Gateway call and GraphQL mutation.
            </p>
          </div>
          <Badge variant="healthy">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Immutable Policy Enforcer</span>
            </span>
          </Badge>
        </div>

        <div className="overflow-x-auto border border-neutral-100 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="py-2.5 px-4 font-semibold text-neutral-500 uppercase tracking-wider w-1/3">Capability Scope</th>
                <th className="py-2.5 px-3 font-semibold text-neutral-700 text-center">Owner</th>
                <th className="py-2.5 px-3 font-semibold text-neutral-700 text-center">Admin</th>
                <th className="py-2.5 px-3 font-semibold text-neutral-700 text-center">Developer</th>
                <th className="py-2.5 px-3 font-semibold text-neutral-700 text-center">Billing Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {PERMISSION_SCOPES.map((scope) => (
                <tr key={scope.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900">{scope.name}</div>
                    <div className="text-[11px] text-neutral-500">{scope.description}</div>
                  </td>
                  {(["Owner", "Admin", "Developer", "Billing Viewer"] as TeamRole[]).map((r) => {
                    const hasAccess = scope.allowedRoles.includes(r);
                    return (
                      <td key={r} className="py-3 px-3 text-center">
                        {hasAccess ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-300">
                            <span className="text-[11px]">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        description="Invited teammates receive a cryptographically signed magic link with hardware 2FA setup instructions."
        size="md"
      >
        <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
          {inviteError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{inviteError}</span>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Corporate Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="colleague@yourcompany.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full px-3 py-2 pl-9 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Assigned Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as TeamRole)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
            >
              <option value="Developer">Developer (Deploy & Rotate Secrets)</option>
              <option value="Admin">Admin (Full Team & Infrastructure Management)</option>
              <option value="Billing Viewer">Billing Viewer (Invoices & Cards Only)</option>
            </select>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-500 text-[11px] space-y-1">
            <span className="font-semibold text-neutral-700 block">Security Provisioning:</span>
            <p>New members must verify their corporate domain and enroll an authentic FIDO2 / WebAuthn security key prior to gaining production access.</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Encrypted Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
