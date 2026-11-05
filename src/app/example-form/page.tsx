"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Copy,
  Search,
  ChevronDown,
  X,
  Shield,
  Key,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

const ROLE_OPTIONS = [
  "Owner / Administrator",
  "Product Designer",
  "Senior Software Engineer",
  "Billing & Finance Manager",
  "Security & DevOps Lead",
];

const AVAILABLE_TAGS = [
  "Core Infrastructure",
  "Design System",
  "Billing API",
  "Customer Analytics",
  "Frontend Web",
  "Mobile Gateway",
];

export default function ExampleFormPage() {
  // Form State
  const [workspaceName, setWorkspaceName] = useState("Acme Production");
  const [email, setEmail] = useState("alex.chen@acme.inc");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [role, setRole] = useState("Product Designer");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Tag Deck State
  const [tags, setTags] = useState<string[]>([
    "Core Infrastructure",
    "Design System",
  ]);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Billing & Toggles State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [apiKey] = useState("zl_live_948f2c310b");
  const [isCopied, setIsCopied] = useState(false);

  // Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Outside click & escape handlers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setIsTagOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRoleOpen(false);
        setIsTagOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    triggerToast("API Key copied to clipboard");
    setTimeout(() => setIsCopied(false), 1800);
  };

  const handleToggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleRemoveTag = (t: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTags((prev) => prev.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      triggerToast("Workspace settings saved successfully!");
    }, 600);
  };

  const filteredRoles = ROLE_OPTIONS.filter((r) =>
    r.toLowerCase().includes(roleFilter.toLowerCase())
  );

  const filteredTags = AVAILABLE_TAGS.filter((t) =>
    t.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col items-center justify-start p-6 sm:p-12 font-sans selection:bg-neutral-200">
      {/* Toast Notification with spring physics */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-neutral-800"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation */}
      <div className="w-full max-w-xl flex items-center justify-between pb-6 border-b border-neutral-200 mb-8">
        <Link href="/docs/atoms" className="flex items-center gap-2 group text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
          <span className="w-6 h-6 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            ZL
          </span>
          <span className="font-semibold text-neutral-900">ZeroLight</span>
          <span className="text-neutral-300">/</span>
          <span>Sample Form</span>
        </Link>

        {/* Form Selector Tabs */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <div className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#111111] text-white shadow-xs">
            Workspace Config
          </div>
          <Link
            href="/fresher-profile"
            className="px-3 py-1 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Job Seeker Bio
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/docs/atoms"
            className="text-xs text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-xs font-medium transition-colors"
          >
            Atoms View
          </Link>
          <Link
            href="/docs/molecules"
            className="text-xs text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-xs font-medium transition-colors"
          >
            Molecules View
          </Link>
        </div>
      </div>

      {/* Main Form Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-xl bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Form Title & Meta Badge */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-neutral-900 tracking-tight">
                Workspace Configuration
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configured using ZeroLight pure atoms and composed molecules.
            </p>
          </div>

          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Layers className="w-4 h-4" strokeWidth={2} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. FormField Molecule: Workspace Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              Workspace name <span className="text-rose-500">*</span>
            </label>
            <div className="h-11 px-3.5 rounded-xl border border-[#D4D4D4] bg-white flex items-center gap-2 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
              <input
                type="text"
                required
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Organization"
                className="w-full bg-transparent text-sm text-neutral-900 outline-none"
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              Unique identifier used in API routes and audit trails.
            </p>
          </div>

          {/* 2. FormField Molecule: Contact Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              Billing administrator email <span className="text-rose-500">*</span>
            </label>
            <div
              style={{
                boxShadow: isEmailFocused ? "0 0 0 3px rgba(17,17,17,0.08)" : "none",
              }}
              className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-all shadow-xs ${
                isEmailFocused ? "border-neutral-900" : "border-[#D4D4D4]"
              }`}
            >
              <Search className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              <input
                type="email"
                required
                value={email}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full bg-transparent text-sm text-neutral-900 outline-none"
              />
            </div>
          </div>

          {/* 3. SearchableSelect Molecule: Role Assignment */}
          <div ref={roleRef} className="relative space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              Default seat role
            </label>
            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              className={`w-full h-11 px-3.5 rounded-xl border bg-white flex items-center justify-between text-left cursor-pointer transition-all shadow-xs ${
                isRoleOpen ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-[#D4D4D4]"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Key className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                <span className="text-sm text-neutral-900 truncate">{role}</span>
              </div>
              <motion.div
                animate={{ rotate: isRoleOpen ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center shrink-0"
              >
                <ChevronDown className="w-3.5 h-3.5 text-neutral-600" strokeWidth={2.2} />
              </motion.div>
            </button>

            {/* Popover Dropdown */}
            <AnimatePresence>
              {isRoleOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 z-30 mt-2 p-1.5 bg-white border border-[#D4D4D4] rounded-xl shadow-xl space-y-1"
                >
                  <input
                    type="text"
                    autoFocus
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    placeholder="Search roles..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-[#F4F4F5] text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-0.5 pt-1">
                    {filteredRoles.map((opt) => {
                      const isSelected = role === opt;
                      const isHovered = hoveredRole === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onMouseEnter={() => setHoveredRole(opt)}
                          onMouseLeave={() => setHoveredRole(null)}
                          onClick={() => {
                            setRole(opt);
                            setIsRoleOpen(false);
                            setRoleFilter("");
                          }}
                          className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-[#111111] text-white font-medium"
                              : isHovered
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. TagDeck Molecule: Project Tags */}
          <div ref={tagRef} className="relative space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              Provisioned project scopes
            </label>

            <div
              className={`w-full min-h-[44px] p-2 rounded-xl border bg-white flex flex-wrap items-center gap-1.5 transition-all shadow-xs ${
                isTagOpen ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-[#D4D4D4]"
              }`}
            >
              {/* Active Tag Chips */}
              <AnimatePresence>
                {tags.map((item) => (
                  <motion.span
                    key={item}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTag(item, e)}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* + Add Tag Trigger Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTagOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-neutral-500" strokeWidth={2.5} />
                <span>Add scope</span>
              </motion.button>
            </div>

            {/* Tag Popover Dropdown */}
            <AnimatePresence>
              {isTagOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 z-30 mt-2 p-1.5 bg-white border border-[#D4D4D4] rounded-xl shadow-xl space-y-1"
                >
                  <input
                    type="text"
                    autoFocus
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    placeholder="Search scopes..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-[#F4F4F5] text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-0.5 pt-1">
                    {filteredTags.map((opt) => {
                      const isSelected = tags.includes(opt);
                      const isHovered = hoveredTag === opt;
                      return (
                        <div
                          key={opt}
                          onMouseEnter={() => setHoveredTag(opt)}
                          onMouseLeave={() => setHoveredTag(null)}
                          onClick={() => handleToggleTag(opt)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isHovered ? "bg-neutral-100" : "transparent"
                          }`}
                        >
                          <span className={isSelected ? "font-semibold text-neutral-900" : "text-neutral-700"}>
                            {opt}
                          </span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isSelected ? "bg-[#111111] border-[#111111]" : "border-neutral-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. SegmentedControl Molecule: Billing Cycle */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-medium text-neutral-700">
              Billing cadence
            </label>
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 relative">
              {[
                { key: "monthly", label: "Monthly invoice" },
                { key: "annual", label: "Annual billing (20% off)" },
              ].map(({ key, label }) => {
                const isSelected = billingCycle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBillingCycle(key as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer relative z-10 transition-colors select-none ${
                      isSelected ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeCyclePill"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-[#111111] rounded-lg shadow-sm -z-10"
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Switch Atom: 2FA Security Enforcement */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Shield className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
              <div>
                <span className="text-xs font-medium text-neutral-900 block">
                  Enforce two-factor authentication (2FA)
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Require hardware keys or authenticator apps for all workspace members.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnforce2FA((prev) => !prev)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                enforce2FA ? "bg-[#111111]" : "bg-neutral-300"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-white shadow-sm ${
                  enforce2FA ? "ml-auto" : "mr-auto"
                }`}
              />
            </button>
          </div>

          {/* 7. InputGroup Molecule: Secret API Key with Copy Button */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-medium text-neutral-700">
              Workspace secret API key
            </label>
            <div className="flex items-center">
              <div className="flex-1 h-11 px-3.5 rounded-l-xl border border-[#D4D4D4] border-r-0 bg-white flex items-center">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="w-full bg-transparent text-xs font-medium tabular-nums text-neutral-700 outline-none"
                />
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleCopyKey}
                className="h-11 px-4 rounded-r-xl border border-[#D4D4D4] bg-[#111111] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs select-none hover:bg-neutral-800 transition-colors"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                ) : (
                  <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                )}
                <span>{isCopied ? "Copied" : "Copy key"}</span>
              </motion.button>
            </div>
          </div>

          {/* 8. Action Buttons (Primary Solid & Secondary Outline with Motion) */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-medium bg-[#111111] text-white hover:bg-neutral-800 shadow-sm flex items-center gap-1.5 cursor-pointer select-none transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <span>Save changes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
