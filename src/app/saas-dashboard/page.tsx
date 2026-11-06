"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Check,
  X,
  SlidersHorizontal,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  ExternalLink,
  Code2,
  Sparkles,
  User,
  Clock,
  Layers,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Building,
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarBg: string;
  role: string;
  department: "Engineering" | "Design" | "Product" | "Operations";
  stage: "Screening" | "Tech Review" | "Final Round" | "Offer Sent";
  score: number;
  experience: string;
  noticePeriod: string;
  expectedSalary: string;
  location: string;
  appliedDate: string;
  skills: string[];
  tags: string[];
  notes: string;
  github?: string;
  portfolio?: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "CAN-101",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    avatar: "AR",
    avatarBg: "bg-blue-600",
    role: "Senior Full-Stack Engineer",
    department: "Engineering",
    stage: "Tech Review",
    score: 94,
    experience: "4.5 yrs",
    noticePeriod: "15 days",
    expectedSalary: "$145,000",
    location: "San Francisco, CA (Remote)",
    appliedDate: "Nov 04, 2026",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js"],
    tags: ["Remote Only", "Top 10% Match", "Notice < 30d"],
    notes: "Demonstrated strong distributed systems knowledge in technical screening. Built custom query caching engine in previous role.",
    github: "github.com/alexrivera",
    portfolio: "alexrivera.dev",
  },
  {
    id: "CAN-102",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    avatar: "ER",
    avatarBg: "bg-purple-600",
    role: "Staff Product Designer",
    department: "Design",
    stage: "Final Round",
    score: 96,
    experience: "6.0 yrs",
    noticePeriod: "Immediate",
    expectedSalary: "$160,000",
    location: "New York, NY",
    appliedDate: "Nov 03, 2026",
    skills: ["Figma", "Design Systems", "Prototyping", "UX Research", "Framer"],
    tags: ["Top 10% Match", "Urgent Hire", "Notice < 30d"],
    notes: "Architected multi-tier B2B design system for enterprise Fintech. Exceptional attention to deterministic typography and spatial density.",
    portfolio: "elenarostova.design",
  },
  {
    id: "CAN-103",
    name: "Marcus Chen",
    email: "m.chen@example.com",
    avatar: "MC",
    avatarBg: "bg-emerald-600",
    role: "Lead DevOps / Platform Architect",
    department: "Engineering",
    stage: "Offer Sent",
    score: 91,
    experience: "5.2 yrs",
    noticePeriod: "30 days",
    expectedSalary: "$175,000",
    location: "Austin, TX (Remote)",
    appliedDate: "Oct 28, 2026",
    skills: ["Kubernetes", "AWS", "Terraform", "Go", "Observability"],
    tags: ["Remote Only", "Offer Pending"],
    notes: "Comprehensive offer extended. Negotiating sign-on bonus and relocation stipend.",
    github: "github.com/marcuschen-ops",
  },
  {
    id: "CAN-104",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    avatar: "PS",
    avatarBg: "bg-amber-600",
    role: "Senior Product Manager",
    department: "Product",
    stage: "Tech Review",
    score: 88,
    experience: "4.0 yrs",
    noticePeriod: "20 days",
    expectedSalary: "$150,000",
    location: "Seattle, WA",
    appliedDate: "Nov 01, 2026",
    skills: ["Product Strategy", "B2B SaaS", "Roadmapping", "SQL", "User Analytics"],
    tags: ["Notice < 30d"],
    notes: "Strong metric-driven approach to product-led growth. Led 0 to 1 enterprise self-serve onboarding flow.",
  },
  {
    id: "CAN-105",
    name: "Jordan Vance",
    email: "jordan.v@example.com",
    avatar: "JV",
    avatarBg: "bg-rose-600",
    role: "Frontend Engineer (Design Engineer)",
    department: "Engineering",
    stage: "Screening",
    score: 85,
    experience: "2.5 yrs",
    noticePeriod: "Immediate",
    expectedSalary: "$120,000",
    location: "Chicago, IL (Remote)",
    appliedDate: "Nov 05, 2026",
    skills: ["React", "Tailwind CSS", "Framer Motion", "TypeScript", "Accessibility"],
    tags: ["Remote Only", "Urgent Hire", "Notice < 30d"],
    notes: "Talented design-engineer portfolio. Created accessible component primitives without heavy third-party dependencies.",
    github: "github.com/jordanvance",
    portfolio: "jordanvance.io",
  },
  {
    id: "CAN-106",
    name: "Devon Miller",
    email: "devon.m@example.com",
    avatar: "DM",
    avatarBg: "bg-cyan-600",
    role: "Customer Operations Lead",
    department: "Operations",
    stage: "Screening",
    score: 79,
    experience: "3.0 yrs",
    noticePeriod: "30 days",
    expectedSalary: "$105,000",
    location: "Denver, CO",
    appliedDate: "Nov 04, 2026",
    skills: ["Customer Success", "SLA Monitoring", "Zendesk", "HubSpot", "Data Analysis"],
    tags: [],
    notes: "Strong background in 24/7 mission-critical B2B enterprise tier-3 customer support.",
  },
  {
    id: "CAN-107",
    name: "Sophia Lindqvist",
    email: "sophia.l@example.com",
    avatar: "SL",
    avatarBg: "bg-teal-600",
    role: "Backend Infrastructure Engineer",
    department: "Engineering",
    stage: "Final Round",
    score: 95,
    experience: "5.5 yrs",
    noticePeriod: "15 days",
    expectedSalary: "$165,000",
    location: "San Francisco, CA",
    appliedDate: "Oct 30, 2026",
    skills: ["Rust", "PostgreSQL", "Kafka", "Distributed Systems", "Docker"],
    tags: ["Top 10% Match", "Notice < 30d"],
    notes: "Outstanding performance on system design architecture round. High throughput data pipeline specialist.",
    github: "github.com/sophialind",
  },
];

export default function SaaSDashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedDeptTab, setSelectedDeptTab] = useState<"All" | "Engineering" | "Design" | "Product" | "Operations">("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All Roles");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [inspectCandidate, setInspectCandidate] = useState<Candidate | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"overview" | "evaluation" | "notes">("overview");

  // Add Candidate modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCandidateName, setNewCandidateName] = useState<string>("");
  const [newCandidateRole, setNewCandidateRole] = useState<string>("Senior Full-Stack Engineer");
  const [newCandidateDept, setNewCandidateDept] = useState<Candidate["department"]>("Engineering");

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Rubric state in drawer
  const [rubricScores, setRubricScores] = useState<{ [id: string]: { tech: number; comm: number; problem: number; notes: string } }>({
    "CAN-101": { tech: 95, comm: 90, problem: 94, notes: "Excellent grasp of state hydration and distributed databases." },
  });

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (selectedDeptTab !== "All" && c.department !== selectedDeptTab) return false;
      if (selectedStage !== "All" && c.stage !== selectedStage) return false;
      if (roleFilter !== "All Roles" && c.role !== roleFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesRole = c.role.toLowerCase().includes(q);
        const matchesSkill = c.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesRole && !matchesSkill) return false;
      }
      return true;
    });
  }, [candidates, selectedDeptTab, selectedStage, roleFilter, searchQuery]);

  // Bulk selection logic
  const isAllSelected = filteredCandidates.length > 0 && selectedCandidateIds.length === filteredCandidates.length;
  const isPartiallySelected = selectedCandidateIds.length > 0 && selectedCandidateIds.length < filteredCandidates.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(filteredCandidates.map((c) => c.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAdvanceStage = (id: string) => {
    const stageOrder: Candidate["stage"][] = ["Screening", "Tech Review", "Final Round", "Offer Sent"];
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const currentIndex = stageOrder.indexOf(c.stage);
          if (currentIndex < stageOrder.length - 1) {
            return { ...c, stage: stageOrder[currentIndex + 1] };
          }
        }
        return c;
      })
    );
    if (inspectCandidate && inspectCandidate.id === id) {
      const currentIndex = stageOrder.indexOf(inspectCandidate.stage);
      if (currentIndex < stageOrder.length - 1) {
        setInspectCandidate((prev) => prev ? { ...prev, stage: stageOrder[currentIndex + 1] } : null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* ══════════════════════════════════════════════════════════
          1. APP SHELL GLOBAL HEADER (ZEROLIGHT ATOMIC FOUNDATION)
         ══════════════════════════════════════════════════════════ */}
      <header className="h-14 border-b border-[#E5E7EB] bg-white sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand & Organization Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              ZL
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                PulseHire
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                PoC
              </span>
            </div>
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          {/* Org Workspace Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700 cursor-pointer hover:bg-neutral-100 transition-colors">
            <Building className="w-3.5 h-3.5 text-neutral-400" />
            <span>ZeroRapid Tech HQ</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 ml-1" />
          </div>
        </div>

        {/* Global Search Bar Molecule */}
        <div className="hidden md:flex items-center gap-2 w-96 h-9 px-3 rounded-xl border border-[#D4D4D4] bg-white focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-2xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search candidates, skills, or pipeline records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 outline-none"
          />
          <kbd className="text-[10px] font-medium text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-100 shrink-0 select-none">
            ⌘K
          </kbd>
        </div>

        {/* Quick CTAs, Studio Link, and User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/docs/atoms"
            className="hidden lg:flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span>Visual Studio</span>
          </Link>

          {/* Solid Black Primary Action Button - Opens Enterprise Modal (No window.prompt!) */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors select-none"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Add Candidate</span>
          </button>

          {/* User Avatar with Status Indicator */}
          <div className="relative cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold border border-neutral-200 shadow-2xs">
              SC
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-xs" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          2. SUB-NAVIGATION BAR (BLACK SLIDING ACTIVE PILL)
         ══════════════════════════════════════════════════════════ */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Animated Black Pill Tabs */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            {(
              [
                { key: "All", label: "All Candidates", count: candidates.length },
                { key: "Engineering", label: "Engineering", count: candidates.filter((c) => c.department === "Engineering").length },
                { key: "Design", label: "Design", count: candidates.filter((c) => c.department === "Design").length },
                { key: "Product", label: "Product", count: candidates.filter((c) => c.department === "Product").length },
                { key: "Operations", label: "Operations", count: candidates.filter((c) => c.department === "Operations").length },
              ] as const
            ).map(({ key, label, count }) => {
              const isActive = selectedDeptTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDeptTab(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer relative transition-colors select-none ${
                    isActive ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="saasDeptTab"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-[#111111] rounded-lg -z-10 shadow-xs"
                    />
                  )}
                  <span className="flex items-center gap-1.5 relative z-10">
                    <span>{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400">
            <span>Deterministic Spatial Rhythm</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. MAIN CONTENT CONTAINER
         ══════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Page Title & Breadcrumb wayfinding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium pb-1">
              <span>Hiring Hub</span>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <span>FY26 Technical Pipeline</span>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <span className="text-neutral-900 font-semibold">{selectedDeptTab} Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Candidate Pipeline Operations
            </h1>
            <p className="text-xs text-neutral-500 pt-0.5">
              High-density talent acquisition matrix with rubrics evaluation and real-time status tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const csvData = candidates.map((c) => `${c.id},"${c.name}",${c.role},${c.department},${c.stage},${c.score}`).join("\n");
                const blob = new Blob([csvData], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "candidates-pipeline.csv";
                a.click();
              }}
              className="h-9 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            4. KPI METRIC STRIP (COMPOSED METRIC TILES)
           ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Metric 1 */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Total Active Pipeline</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 tabular-nums">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums tracking-tight">
              1,248
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              Across 14 open engineering & design requisitions
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Technical Evaluation</span>
              <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums tracking-tight">
              84
            </div>
            <div className="text-[11px] text-neutral-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>12 candidates require rubric scoring</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Scheduled Interviews</span>
              <span className="text-[11px] font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full tabular-nums">
                Week 45
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums tracking-tight">
              32
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">
              6 scheduled for final rounds today
            </div>
          </div>

          {/* Metric 4: Capacity Meter */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Offer Acceptance Rate</span>
              <span className="text-[11px] font-bold text-emerald-600 tabular-nums">
                92.5%
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {/* Naked Capacity Bar Track (Atom) */}
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden relative">
                <div
                  style={{ width: "92.5%" }}
                  className="h-full bg-[#111111] rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium tabular-nums">
                <span>Target: 85.0%</span>
                <span className="text-neutral-900 font-semibold">Exceeding Plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            5. FILTERING & ACTION TOOLBAR (COMPOSED MOLECULES)
           ══════════════════════════════════════════════════════════ */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input Filter */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, role, email, or skill..."
                className="w-full h-9.5 pl-9 pr-3 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stage Segmented Control Filter */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl text-xs overflow-x-auto no-scrollbar">
              {["All", "Screening", "Tech Review", "Final Round", "Offer Sent"].map((stage) => {
                const isActive = selectedStage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap select-none ${
                      isActive
                        ? "bg-[#111111] text-white font-semibold shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>

            {/* Department / Role Selector - ZeroLight Custom Popover (No Native Select!) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                className="h-9.5 px-3 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 hover:border-neutral-900 transition-colors cursor-pointer flex items-center gap-2 select-none"
              >
                <span>{roleFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-neutral-200 rounded-xl shadow-xl p-1 z-30 space-y-0.5"
                  >
                    {[
                      "All Roles",
                      "Senior Full-Stack Engineer",
                      "Staff Product Designer",
                      "Lead DevOps / Platform Architect",
                      "Senior Product Manager",
                      "Frontend Engineer (Design Engineer)",
                    ].map((opt) => {
                      const isSelected = roleFilter === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setRoleFilter(opt);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-neutral-900 text-white font-medium"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <span className="truncate">{opt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Filter Tag Chips Deck */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider">Quick Filters:</span>
            {[
              { label: "Remote Only", query: "Remote" },
              { label: "Notice < 30d", query: "15 days" },
              { label: "Top Rubric (>90)", query: "9" },
            ].map(({ label, query }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSearchQuery(searchQuery === query ? "" : query)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  searchQuery === query
                    ? "bg-[#111111] text-white border-neutral-900 font-semibold"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {label}
              </button>
            ))}
            {(searchQuery || selectedStage !== "All" || roleFilter !== "All Roles" || selectedDeptTab !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStage("All");
                  setRoleFilter("All Roles");
                  setSelectedDeptTab("All");
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            6. BULK ACTIONS BAR (DYNAMIC POPUP ON SELECTION)
           ══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedCandidateIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 bg-[#111111] text-white rounded-xl shadow-lg flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px] tabular-nums">
                  {selectedCandidateIds.length}
                </span>
                <span className="font-semibold">
                  candidates selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    selectedCandidateIds.forEach((id) => handleAdvanceStage(id));
                    setSelectedCandidateIds([]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Bulk Advance Stage
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCandidateIds([])}
                  className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════
            7. ENTERPRISE DATA TABLE ORGANISM
           ══════════════════════════════════════════════════════════ */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              {/* Sticky Table Header */}
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] text-neutral-500 select-none">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="w-4 h-4 rounded border border-neutral-300 bg-white flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors"
                    >
                      {isAllSelected && <Check className="w-3 h-3 text-neutral-900" strokeWidth={3} />}
                      {isPartiallySelected && <div className="w-2 h-0.5 bg-neutral-900 rounded" />}
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Candidate</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Role & Dept</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Rubric Match</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Exp & Notice</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Applied</th>
                  <th className="py-3 px-4 text-right font-semibold uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      <div className="space-y-1">
                        <AlertCircle className="w-6 h-6 mx-auto text-neutral-300" />
                        <p className="font-semibold text-neutral-700">No candidates found</p>
                        <p className="text-[11px] text-neutral-400">Try adjusting your search criteria or stage filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => {
                    const isSelected = selectedCandidateIds.includes(candidate.id);
                    return (
                      <tr
                        key={candidate.id}
                        className={`hover:bg-[#F8F9FA]/80 transition-colors group cursor-pointer ${
                          isSelected ? "bg-neutral-50" : ""
                        }`}
                        onClick={() => setInspectCandidate(candidate)}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleRow(candidate.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#111111] border-neutral-900 text-white"
                                : "border-neutral-300 bg-white hover:border-neutral-500"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </button>
                        </td>

                        {/* Candidate Identity */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${candidate.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                              {candidate.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 group-hover:text-black transition-colors flex items-center gap-1.5">
                                <span>{candidate.name}</span>
                                {candidate.tags.includes("Top 10% Match") && (
                                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                                {candidate.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Department */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-neutral-800">{candidate.role}</div>
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                            candidate.department === "Engineering"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : candidate.department === "Design"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : candidate.department === "Product"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          }`}>
                            {candidate.department}
                          </span>
                        </td>

                        {/* Rubric Match Score */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className={candidate.score >= 90 ? "text-emerald-600" : "text-neutral-800"}>
                                {candidate.score}%
                              </span>
                              <span className="text-[10px] text-neutral-400 font-normal">fit</span>
                            </div>
                            <div className="w-24 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                              <div
                                style={{ width: `${candidate.score}%` }}
                                className={`h-full rounded-full ${
                                  candidate.score >= 90 ? "bg-emerald-600" : candidate.score >= 80 ? "bg-neutral-800" : "bg-amber-500"
                                }`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Pipeline Stage Status Pill */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            candidate.stage === "Offer Sent"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : candidate.stage === "Final Round"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : candidate.stage === "Tech Review"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              candidate.stage === "Offer Sent"
                                ? "bg-emerald-500"
                                : candidate.stage === "Final Round"
                                ? "bg-purple-500"
                                : candidate.stage === "Tech Review"
                                ? "bg-blue-500"
                                : "bg-neutral-500"
                            }`} />
                            <span>{candidate.stage}</span>
                          </span>
                        </td>

                        {/* Experience & Notice */}
                        <td className="py-3 px-4 text-neutral-700">
                          <div className="font-medium">{candidate.experience}</div>
                          <div className="text-[11px] text-neutral-400">{candidate.noticePeriod}</div>
                        </td>

                        {/* Applied Date */}
                        <td className="py-3 px-4 text-neutral-500 text-[11px]">
                          {candidate.appliedDate}
                        </td>

                        {/* Row Actions */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectCandidate(candidate)}
                              className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 cursor-pointer shadow-2xs transition-colors"
                            >
                              Review
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(candidate.id)}
                              title="Advance to Next Stage"
                              className="p-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black cursor-pointer transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
            <div>
              Showing <span className="font-semibold text-neutral-900">{filteredCandidates.length}</span> of{" "}
              <span className="font-semibold text-neutral-900">{candidates.length}</span> candidates
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded-md border border-neutral-200 bg-white text-neutral-300 cursor-not-allowed text-xs font-medium"
              >
                Previous
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-md border border-neutral-900 bg-[#111111] text-white text-xs font-semibold"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded-md border border-neutral-200 bg-white text-neutral-400 cursor-not-allowed text-xs font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════
          8. CANDIDATE EVALUATION SLIDE-OVER DRAWER
         ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {inspectCandidate && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setInspectCandidate(null)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="w-screen max-w-xl bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-neutral-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${inspectCandidate.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                        {inspectCandidate.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-neutral-900">
                            {inspectCandidate.name}
                          </h2>
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-semibold border border-neutral-200">
                            {inspectCandidate.id}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium">
                          {inspectCandidate.role}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectCandidate(null)}
                      className="w-8 h-8 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Drawer Tab Navigation */}
                  <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl text-xs">
                    {(
                      [
                        { key: "overview", label: "Candidate Profile" },
                        { key: "evaluation", label: "Rubrics & Scoring" },
                        { key: "notes", label: "Interview Log" },
                      ] as const
                    ).map(({ key, label }) => {
                      const isActive = activeDrawerTab === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveDrawerTab(key)}
                          className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#111111] text-white font-semibold shadow-xs"
                              : "text-neutral-500 hover:text-neutral-900"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Scrollable Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
                  {activeDrawerTab === "overview" && (
                    <div className="space-y-6">
                      
                      {/* Key Profile Parameters Grid */}
                      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 tabular-nums">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Expected Salary</span>
                          <span className="text-sm font-bold text-neutral-900">{inspectCandidate.expectedSalary}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Notice Period</span>
                          <span className="text-sm font-bold text-neutral-900">{inspectCandidate.noticePeriod}</span>
                        </div>
                        <div className="pt-2 border-t border-neutral-200">
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Experience</span>
                          <span className="text-sm font-semibold text-neutral-800">{inspectCandidate.experience}</span>
                        </div>
                        <div className="pt-2 border-t border-neutral-200">
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Location</span>
                          <span className="text-sm font-semibold text-neutral-800 truncate block">{inspectCandidate.location}</span>
                        </div>
                      </div>

                      {/* Skills Tag Deck Molecule */}
                      <div className="space-y-2">
                        <span className="text-neutral-500 font-semibold block text-[11px] uppercase tracking-wider">
                          Validated Core Competencies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inspectCandidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-800 text-xs font-medium shadow-2xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recruiter Evaluation Notes */}
                      <div className="space-y-2">
                        <span className="text-neutral-500 font-semibold block text-[11px] uppercase tracking-wider">
                          Screening Summary
                        </span>
                        <div className="p-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 leading-relaxed shadow-2xs">
                          {inspectCandidate.notes}
                        </div>
                      </div>

                      {/* Portfolio & Github Links */}
                      {(inspectCandidate.github || inspectCandidate.portfolio) && (
                        <div className="space-y-2">
                          <span className="text-neutral-500 font-semibold block text-[11px] uppercase tracking-wider">
                            Verified Work Samples
                          </span>
                          <div className="space-y-1.5">
                            {inspectCandidate.github && (
                              <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 font-medium">
                                <div className="flex items-center gap-2">
                                  <Code2 className="w-4 h-4 text-neutral-600" />
                                  <span>{inspectCandidate.github}</span>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            )}
                            {inspectCandidate.portfolio && (
                              <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 font-medium">
                                <div className="flex items-center gap-2">
                                  <ExternalLink className="w-4 h-4 text-neutral-600" />
                                  <span>{inspectCandidate.portfolio}</span>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeDrawerTab === "evaluation" && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-neutral-900">Technical Competence</span>
                          <span className="font-bold text-neutral-900 tabular-nums">92 / 100</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="92"
                          className="w-full accent-neutral-900 cursor-pointer"
                        />

                        <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                          <span className="font-semibold text-neutral-900">System Design & Problem Solving</span>
                          <span className="font-bold text-neutral-900 tabular-nums">88 / 100</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="88"
                          className="w-full accent-neutral-900 cursor-pointer"
                        />

                        <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                          <span className="font-semibold text-neutral-900">Cross-Functional Communication</span>
                          <span className="font-bold text-neutral-900 tabular-nums">95 / 100</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="95"
                          className="w-full accent-neutral-900 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-semibold text-neutral-700">Interview Feedback & Recommendation</label>
                        <textarea
                          rows={4}
                          placeholder="Record detailed evaluation feedback..."
                          defaultValue="Strong hire recommendation for Senior Engineering requisition. High velocity, clean code execution."
                          className="w-full p-3 rounded-xl border border-neutral-300 bg-white text-xs outline-none focus:border-neutral-900 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {activeDrawerTab === "notes" && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1">
                        <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                          <span>Technical Screening • Sarah Connor</span>
                          <span>Nov 04, 2026</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed font-normal">
                          Completed live architecture coding challenge. Designed reliable event ingestion service with backpressure handling.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1">
                        <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                          <span>Recruiter Intro • Jordan Vance</span>
                          <span>Nov 02, 2026</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed font-normal">
                          Cultural alignment check passed. Candidate values deterministic UI performance and high agency engineering teams.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky CTA Drawer Footer */}
                <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const name = inspectCandidate.name;
                      setCandidates((prev) => prev.filter((c) => c.id !== inspectCandidate.id));
                      triggerToast(`Archived application for ${name}`);
                      setInspectCandidate(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-600 hover:text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Reject Candidate
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAdvanceStage(inspectCandidate.id);
                      triggerToast(`Advanced ${inspectCandidate.name} to next stage`);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors select-none"
                  >
                    <span>Advance to Next Stage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Candidate Modal - ZeroLight Enterprise Dialog (No window.prompt!) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-2xl p-6 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Add Candidate to Pipeline</h3>
                  <p className="text-xs text-neutral-500">Register candidate record into screening round.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-neutral-700">Full Name *</label>
                  <input
                    type="text"
                    autoFocus
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full h-9 px-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-700">Role Title</label>
                  <input
                    type="text"
                    value={newCandidateRole}
                    onChange={(e) => setNewCandidateRole(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-neutral-700">Department</label>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {(["Engineering", "Design", "Product", "Operations"] as const).map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setNewCandidateDept(dept)}
                        className={`py-1.5 text-center rounded-lg border font-medium cursor-pointer transition-colors ${
                          newCandidateDept === dept
                            ? "bg-neutral-900 text-white border-neutral-900 font-semibold"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newCandidateName.trim()}
                  onClick={() => {
                    const name = newCandidateName.trim();
                    const newCand: Candidate = {
                      id: `CAN-${Math.floor(108 + Math.random() * 899)}`,
                      name,
                      email: `${name.toLowerCase().replace(/\s+/g, ".")}@pulsehire.io`,
                      avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
                      avatarBg: "bg-neutral-800",
                      role: newCandidateRole,
                      department: newCandidateDept,
                      stage: "Screening",
                      score: 85,
                      experience: "3.5 yrs",
                      noticePeriod: "30 days",
                      expectedSalary: "$125,000",
                      location: "Remote",
                      appliedDate: "Today",
                      skills: ["TypeScript", "System Design"],
                      tags: ["Active Pipeline"],
                      notes: "Candidate registered into screening round via PulseHire console.",
                    };
                    setCandidates((prev) => [newCand, ...prev]);
                    triggerToast(`Added ${name} to pipeline`);
                    setNewCandidateName("");
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white disabled:opacity-40 cursor-pointer shadow-xs transition-colors select-none"
                >
                  Register Candidate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2 border border-neutral-800"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          9. FOOTER
         ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 px-6 text-center text-xs text-neutral-400">
        Built with <Link href="/docs/atoms" className="text-neutral-900 font-semibold hover:underline">ZeroLight Design System</Link> • WCAG AAA Deterministic Layout
      </footer>
    </div>
  );
}
