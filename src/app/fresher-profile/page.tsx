"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Search,
  ChevronDown,
  X,
  User,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Code2,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

const DEGREE_OPTIONS = [
  "B.Tech in Computer Science & Engineering",
  "B.S. in Software Engineering",
  "B.Des in Interaction & UI/UX Design",
  "B.Sc in Information Technology",
  "Master of Computer Applications (MCA)",
  "M.S. in Computer Science",
];

const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Framer Motion",
  "JavaScript (ES6+)",
  "Node.js",
  "Git & GitHub",
  "REST APIs",
  "Figma",
  "Python",
  "SQL / PostgreSQL",
];

export default function FresherProfilePage() {
  // Personal Info
  const [fullName, setFullName] = useState("Aarav Sharma");
  const [headline, setHeadline] = useState("Frontend Engineer & UI Systems Enthusiast");
  const [email, setEmail] = useState("aarav.sharma25@university.edu");
  const [location, setLocation] = useState("Bengaluru, India");
  const [bio, setBio] = useState(
    "Final-year CS undergrad passionate about design systems, accessible UI atoms, and fluid micro-interactions. Built 4 production-ready React web apps and eager to contribute to high-velocity product teams."
  );

  // Education Dropdown
  const [degree, setDegree] = useState("B.Tech in Computer Science & Engineering");
  const [isDegreeOpen, setIsDegreeOpen] = useState(false);
  const [degreeFilter, setDegreeFilter] = useState("");
  const [hoveredDegree, setHoveredDegree] = useState<string | null>(null);
  const degreeRef = useRef<HTMLDivElement>(null);

  // Graduation Year (Segmented Control)
  const [gradYear, setGradYear] = useState<"2024" | "2025" | "2026">("2025");

  // Skills Tag Deck
  const [skills, setSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Git & GitHub",
  ]);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [skillFilter, setSkillFilter] = useState("");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const skillRef = useRef<HTMLDivElement>(null);

  // Preferences
  const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "onsite">("remote");
  const [employmentType, setEmploymentType] = useState<"fulltime" | "internship">("fulltime");
  const [immediateJoin, setImmediateJoin] = useState(true);

  // Links
  const [githubUrl, setGithubUrl] = useState("github.com/aaravsharma");
  const [portfolioUrl, setPortfolioUrl] = useState("aarav.design");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Click Outside Listeners
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (degreeRef.current && !degreeRef.current.contains(e.target as Node)) {
        setIsDegreeOpen(false);
      }
      if (skillRef.current && !skillRef.current.contains(e.target as Node)) {
        setIsSkillOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddSkill = (skillToAdd: string) => {
    if (!skills.includes(skillToAdd)) {
      setSkills((prev) => [...prev, skillToAdd]);
    }
    setIsSkillOpen(false);
    setSkillFilter("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 850);
  };

  const filteredDegrees = DEGREE_OPTIONS.filter((d) =>
    d.toLowerCase().includes(degreeFilter.toLowerCase())
  );

  const filteredSkills = AVAILABLE_SKILLS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(skillFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans antialiased pb-20">
      {/* 1. Universal Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#D4D4D4] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-[#111111] flex items-center justify-center text-white text-[11px] font-bold">
              Z
            </div>
            ZeroLight
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-xs text-neutral-500 font-medium">Job Seeker Bio Form</span>
        </div>

        {/* Form Selector Tabs */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <Link
            href="/example-form"
            className="px-3 py-1 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Workspace Config
          </Link>
          <div className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#111111] text-white shadow-xs">
            Job Seeker Bio
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/docs/atoms"
            className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Atoms
          </Link>
          <Link
            href="/docs/molecules"
            className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Molecules
          </Link>
        </div>
      </header>

      {/* 2. Main Page Container */}
      <main className="max-w-2xl mx-auto px-6 pt-10">
        {/* Profile Card Header with Avatar Atom */}
        <div className="bg-white border border-[#D4D4D4] rounded-2xl p-6 shadow-xs mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar Atom with Online Availability Badge */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold shadow-inner">
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span
                  title="Open to Work"
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-neutral-900">{fullName}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Fresher '25
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{headline}</p>
                <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  {location} • Active 2h ago
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              <span>Resume attached</span>
            </div>
          </div>
        </div>

        {/* 3. Success Feedback Toast / Alert */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Candidate bio published!</strong> Your profile is now visible to verified hiring managers.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-emerald-700 hover:text-emerald-900 font-semibold ml-4"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Form Container */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Section: Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-400">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="h-11 px-3.5 rounded-xl border border-[#D4D4D4] bg-white flex items-center gap-2 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
                  <User className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">
                  Contact email <span className="text-rose-500">*</span>
                </label>
                <div className="h-11 px-3.5 rounded-xl border border-[#D4D4D4] bg-white flex items-center gap-2 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@domain.com"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Professional Headline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Professional headline / Target role <span className="text-rose-500">*</span>
              </label>
              <div className="h-11 px-3.5 rounded-xl border border-[#D4D4D4] bg-white flex items-center gap-2 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
                <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Junior Frontend Developer | React & TypeScript"
                  className="w-full bg-transparent text-sm text-neutral-900 outline-none"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                A concise one-liner highlighting your core domain and immediate role aspirations.
              </p>
            </div>

            {/* Bio / Summary (Textarea Atom) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-700">
                  Candidate Bio & Summary
                </label>
                <span className="text-[10px] text-neutral-400">{bio.length} / 300</span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical interests, notable capstone projects, or what excites you about early engineering roles..."
                className="w-full p-3.5 rounded-xl border border-[#D4D4D4] bg-white text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all shadow-xs resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Section: Education & Academics */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-400">
              Academics & Graduation
            </h2>

            {/* Degree Select Molecule */}
            <div ref={degreeRef} className="relative space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Highest qualification / Degree <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDegreeOpen((prev) => !prev)}
                className={`w-full h-11 px-3.5 rounded-xl border bg-white flex items-center justify-between text-left cursor-pointer transition-all shadow-xs ${
                  isDegreeOpen ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-[#D4D4D4]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <GraduationCap className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                  <span className="text-sm text-neutral-900 truncate">{degree}</span>
                </div>
                <motion.div
                  animate={{ rotate: isDegreeOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center shrink-0"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-600" strokeWidth={2.2} />
                </motion.div>
              </button>

              {/* Popover Dropdown */}
              <AnimatePresence>
                {isDegreeOpen && (
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
                      value={degreeFilter}
                      onChange={(e) => setDegreeFilter(e.target.value)}
                      placeholder="Search degree..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-[#F4F4F5] text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                    <div className="max-h-44 overflow-y-auto space-y-0.5 pt-1">
                      {filteredDegrees.map((opt) => {
                        const isSelected = degree === opt;
                        const isHovered = hoveredDegree === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onMouseEnter={() => setHoveredDegree(opt)}
                            onMouseLeave={() => setHoveredDegree(null)}
                            onClick={() => {
                              setDegree(opt);
                              setIsDegreeOpen(false);
                              setDegreeFilter("");
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

            {/* Graduation Year (Segmented Control Molecule) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Graduation cohort year
              </label>
              <div className="relative p-1 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center gap-1">
                {(["2024", "2025", "2026"] as const).map((year) => {
                  const isActive = gradYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setGradYear(year)}
                      className={`relative z-10 flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center ${
                        isActive ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCohortPill"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-[#111111] rounded-lg shadow-sm -z-10"
                        />
                      )}
                      <span>Class of {year}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Section: Technical Skills (TagDeck Molecule) */}
          <div ref={skillRef} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-neutral-700">
                Core technical skills <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-neutral-400">{skills.length} added</span>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-wrap items-center gap-2 min-h-12">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-neutral-800 border border-[#D4D4D4] shadow-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="w-3.5 h-3.5 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Add Skill Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSkillOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 bg-white transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add skill</span>
                </button>

                {/* Popover */}
                <AnimatePresence>
                  {isSkillOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 z-30 mt-2 w-56 p-1.5 bg-white border border-[#D4D4D4] rounded-xl shadow-xl space-y-1"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-[#F4F4F5] text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                      />
                      <div className="max-h-40 overflow-y-auto space-y-0.5 pt-1">
                        {filteredSkills.length === 0 ? (
                          <p className="px-2.5 py-2 text-[11px] text-neutral-400">
                            No more matching skills
                          </p>
                        ) : (
                          filteredSkills.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onMouseEnter={() => setHoveredSkill(s)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              onClick={() => handleAddSkill(s)}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left cursor-pointer transition-colors ${
                                hoveredSkill === s
                                  ? "bg-neutral-100 text-neutral-900"
                                  : "text-neutral-700"
                              }`}
                            >
                              + {s}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Section: Work Mode & Availability */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-400">
              Work Preferences & Availability
            </h2>

            {/* Segmented Control: Work Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Preferred work arrangement
              </label>
              <div className="relative p-1 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center gap-1">
                {(["remote", "hybrid", "onsite"] as const).map((mode) => {
                  const isActive = workMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setWorkMode(mode)}
                      className={`relative z-10 flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer text-center ${
                        isActive ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeWorkModePill"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-[#111111] rounded-lg shadow-sm -z-10"
                        />
                      )}
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Employment Type Radio Atoms */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-medium text-neutral-700">
                Target employment type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: "fulltime", label: "Full-Time Entry Role", desc: "Permanent early-career position" },
                  { id: "internship", label: "Graduate Internship", desc: "3-6 month high-impact internship" },
                ].map((item) => {
                  const isChecked = employmentType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setEmploymentType(item.id as "fulltime" | "internship")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? "border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "border-[#111111] bg-[#111111]" : "border-neutral-400 bg-white"
                        }`}
                      >
                        {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-900">{item.label}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Switch Atom: Immediate Join */}
            <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                  Available for immediate joining
                </span>
                <p className="text-[11px] text-neutral-400">
                  Ready to start within 7 calendar days of offer acceptance.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={immediateJoin}
                onClick={() => setImmediateJoin((prev) => !prev)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  immediateJoin ? "bg-[#111111]" : "bg-neutral-300"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`block w-5 h-5 rounded-full bg-white shadow-sm mt-0.5 ${
                    immediateJoin ? "ml-[22px]" : "ml-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Section: Links & Profiles (InputGroup Molecules) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-400">
              Portfolio & Coding Profiles
            </h2>

            {/* GitHub URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                GitHub profile
              </label>
              <div className="h-11 rounded-xl border border-[#D4D4D4] bg-white flex items-center overflow-hidden focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
                <div className="h-full px-3 bg-neutral-100 border-r border-[#D4D4D4] flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Code2 className="w-3.5 h-3.5 text-neutral-700" />
                  <span>https://</span>
                </div>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="github.com/username"
                  className="w-full px-3 bg-transparent text-sm text-neutral-900 outline-none"
                />
              </div>
            </div>

            {/* Portfolio Website */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Live portfolio / Project website
              </label>
              <div className="h-11 rounded-xl border border-[#D4D4D4] bg-white flex items-center overflow-hidden focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-xs">
                <div className="h-full px-3 bg-neutral-100 border-r border-[#D4D4D4] flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Globe className="w-3.5 h-3.5 text-neutral-700" />
                  <span>https://</span>
                </div>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="portfolio.dev"
                  className="w-full px-3 bg-transparent text-sm text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Form Actions (Button Atoms Matrix) */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="h-11 px-5 rounded-xl border border-[#D4D4D4] bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              Save as Draft
            </button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="h-11 px-6 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Publishing Bio...</span>
                </>
              ) : (
                <>
                  <span>Publish Profile Bio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
}
