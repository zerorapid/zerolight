"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  CheckCircle2,
  Download,
  Phone,
  ArrowLeft,
  Check,
  X,
  Send,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";
import {
  ZeroLightProvider,
  ZeroLightTokens,
  useZeroLight,
} from "@/components/zerolight";
import {
  Button,
  Badge,
  Avatar,
  ProgressBar,
} from "@/components/zerolight/atoms";
import {
  StatCard,
  SearchBar,
  Select,
  SegmentedControl,
  Pagination,
  AlertBanner,
} from "@/components/zerolight/molecules";

// Exact tokens requested by user
const SCHOOL_ATTENDANCE_TOKENS: ZeroLightTokens = {
  scaleMultiplier: 1.0,
  universalBorderColor: "#D4D4D4",
  universalFillColor: "#FFFFFF",
  textIconColor: "#111111",
  primaryButtonColor: "#510981",
  hoverBackplateTint: "#F4F4F5",
  borderWidth: 1,
  cornerRadius: 24,
  heightDensity: 44,
  menuOffsetGap: 8,
  fontSize: 14,
  motionPhysics: "damped",
  iconScaleMultiplier: 1.0,
  iconStrokeWidth: 2.0,
  iconFill: "none",
  iconColor: "#510981",
};

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  grade: "9" | "10" | "11" | "12";
  section: "A" | "B" | "C";
  avatar: string;
  gender: "female" | "male";
  status: AttendanceStatus;
  checkInTime: string;
  parentName: string;
  parentPhone: string;
  notes?: string;
  recentAttendanceRate: number;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "stu-101",
    name: "Aria Montgomery",
    rollNumber: "STU-1024",
    grade: "10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    gender: "female",
    status: "present",
    checkInTime: "08:12 AM",
    parentName: "Ella Montgomery",
    parentPhone: "+1 (555) 234-8901",
    notes: "Science fair project lead",
    recentAttendanceRate: 98,
  },
  {
    id: "stu-102",
    name: "Marcus Vance",
    rollNumber: "STU-1025",
    grade: "10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    gender: "male",
    status: "present",
    checkInTime: "08:05 AM",
    parentName: "David Vance",
    parentPhone: "+1 (555) 345-6712",
    notes: "Varsity track captain",
    recentAttendanceRate: 96,
  },
  {
    id: "stu-103",
    name: "Chloe Zhao",
    rollNumber: "STU-1026",
    grade: "10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    gender: "female",
    status: "absent",
    checkInTime: "--:--",
    parentName: "Wei Zhao",
    parentPhone: "+1 (555) 890-1234",
    notes: "Unexcused absence - parent SMS sent",
    recentAttendanceRate: 88,
  },
  {
    id: "stu-104",
    name: "Ethan Wright",
    rollNumber: "STU-1027",
    grade: "10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    gender: "male",
    status: "late",
    checkInTime: "08:42 AM",
    parentName: "Sarah Wright",
    parentPhone: "+1 (555) 456-7890",
    notes: "Arrived with front gate pass (bus breakdown)",
    recentAttendanceRate: 92,
  },
  {
    id: "stu-105",
    name: "Sophia Martinez",
    rollNumber: "STU-1028",
    grade: "10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    gender: "female",
    status: "excused",
    checkInTime: "--:--",
    parentName: "Carlos Martinez",
    parentPhone: "+1 (555) 567-8901",
    notes: "Medical appointment slip submitted",
    recentAttendanceRate: 94,
  },
  {
    id: "stu-106",
    name: "Lucas Bennett",
    rollNumber: "STU-1029",
    grade: "10",
    section: "B",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    gender: "male",
    status: "present",
    checkInTime: "08:14 AM",
    parentName: "James Bennett",
    parentPhone: "+1 (555) 678-9012",
    notes: "Robotics club member",
    recentAttendanceRate: 99,
  },
  {
    id: "stu-107",
    name: "Hannah Kim",
    rollNumber: "STU-1030",
    grade: "10",
    section: "B",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    gender: "female",
    status: "present",
    checkInTime: "08:18 AM",
    parentName: "Grace Kim",
    parentPhone: "+1 (555) 789-0123",
    notes: "Honor roll student",
    recentAttendanceRate: 100,
  },
  {
    id: "stu-108",
    name: "Liam O'Connor",
    rollNumber: "STU-1031",
    grade: "10",
    section: "B",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    gender: "male",
    status: "absent",
    checkInTime: "--:--",
    parentName: "Patrick O'Connor",
    parentPhone: "+1 (555) 901-2345",
    notes: "Absence notice pending parent verification",
    recentAttendanceRate: 85,
  },
  {
    id: "stu-109",
    name: "Maya Patel",
    rollNumber: "STU-1032",
    grade: "11",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    gender: "female",
    status: "present",
    checkInTime: "08:02 AM",
    parentName: "Raj Patel",
    parentPhone: "+1 (555) 012-3456",
    notes: "Student council representative",
    recentAttendanceRate: 97,
  },
  {
    id: "stu-110",
    name: "Noah Campbell",
    rollNumber: "STU-1033",
    grade: "11",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    gender: "male",
    status: "present",
    checkInTime: "08:11 AM",
    parentName: "Fiona Campbell",
    parentPhone: "+1 (555) 123-4567",
    notes: "Orchestra concert pianist",
    recentAttendanceRate: 95,
  },
];

export function SchoolAttendanceInner() {
  const { tokens, scaled } = useZeroLight();

  // Filter states
  const [gradeFilter, setGradeFilter] = useState<string>("10");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Selected student for detail sheet
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);

  // Submit confirmation modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Status counters
  const totalEnrolled = students.length;
  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const excusedCount = students.filter((s) => s.status === "excused").length;
  const attendancePercentage = ((presentCount + lateCount) / totalEnrolled) * 100;

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
      const matchSection = sectionFilter === "all" || s.section === sectionFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSection && matchStatus && matchSearch;
    });
  }, [students, gradeFilter, sectionFilter, statusFilter, searchQuery]);

  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Bulk selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Status updates
  const handleUpdateStatus = (id: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        let time = s.checkInTime;
        if (newStatus === "present" && time === "--:--") time = "08:24 AM";
        if (newStatus === "late") time = "08:45 AM";
        if (newStatus === "absent" || newStatus === "excused") time = "--:--";
        return { ...s, status: newStatus, checkInTime: time };
      })
    );
    showToast(`Updated attendance status for ${students.find((s) => s.id === id)?.name}`);
  };

  const handleBulkUpdate = (newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: newStatus } : s
      )
    );
    showToast(`Marked ${selectedIds.length} selected students as ${newStatus}`);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-purple-100">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              backgroundColor: tokens.primaryButtonColor,
              color: scaled.primaryActionTextColor,
            }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-xs font-semibold shadow-xl flex items-center gap-2 select-none"
          >
            <CheckCircle2 size={15} strokeWidth={2.5} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Application Header */}
      <header
        style={{
          borderColor: tokens.universalBorderColor,
          borderBottomWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="shrink-0 sticky top-0 z-40 px-6 py-3 border-b flex items-center justify-between select-none shadow-2xs backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors p-1 rounded-lg hover:bg-neutral-100"
            title="Return to ZeroLight Studio"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline font-medium">Studio</span>
          </Link>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: tokens.primaryButtonColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: scaled.primaryActionTextColor,
              }}
              className="w-8 h-8 flex items-center justify-center font-bold text-xs shadow-xs"
            >
              <GraduationCap size={18} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-[#111111]">
                  St. Jude Collegiate Academy
                </span>
                <span
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                  }}
                  className="text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider text-neutral-500 hidden md:inline-block"
                >
                  Homeroom Register
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Daily Attendance Intelligence &amp; Parent Telemetry Suite
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
            <CalendarDays size={14} className="text-neutral-400" />
            <span className="font-medium">Tuesday, Nov 10, 2026</span>
            <span className="text-neutral-300">•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Period 1 Open
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download />}
            onClick={() => showToast("Exporting attendance register as CSV / PDF...")}
            className="hidden sm:inline-flex"
          >
            Export Register
          </Button>

          <Button
            variant="primary"
            size="sm"
            iconLeft={isSubmitted ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            onClick={() => setIsSubmitModalOpen(true)}
          >
            {isSubmitted ? "Submitted" : "Submit Attendance"}
          </Button>

          {/* Teacher Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
            <Avatar
              initials="EV"
              size="sm"
              status="online"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              alt="Evelyn Carter"
            />
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Unexcused Absences Warning Banner */}
        {absentCount > 0 && (
          <AlertBanner
            severity="warning"
            title={`${absentCount} Unverified Student Absences Flagged for Immediate Action`}
            description="Parent contact protocol requires automated SMS notification within 30 minutes of homeroom bell (08:30 AM). 2 absences remain unexcused."
            action={
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Phone />}
                onClick={() => showToast("Broadcasting automated absence SMS to emergency guardians...")}
              >
                Send Parent SMS
              </Button>
            }
          />
        )}

        {/* Stat Cards Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Attendance Rate"
            value={`${attendancePercentage.toFixed(1)}%`}
            delta="+1.4%"
            trend="up"
            comparisonText="vs district benchmark"
          />
          <StatCard
            label="Present in Class"
            value={`${presentCount} / ${totalEnrolled}`}
            delta="92.1%"
            trend="up"
            comparisonText="on-time gate check-ins"
          />
          <StatCard
            label="Unexcused Absences"
            value={`${absentCount}`}
            delta="-2"
            trend="down"
            comparisonText="requires follow-up"
          />
          <StatCard
            label="Tardy & Excused"
            value={`${lateCount + excusedCount}`}
            delta="2 verified"
            trend="neutral"
            comparisonText="medical or bus delay"
          />
        </div>

        {/* Filter and Command Toolbar */}
        <div
          style={{
            borderRadius: `${scaled.scaledCardRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
            boxShadow: scaled.cardShadow,
          }}
          className="p-4 sm:p-5 border space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Grade Selector Segmented Control */}
            <div className="flex flex-wrap items-center gap-3">
              <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 font-semibold uppercase tracking-wider">
                Grade:
              </span>
              <SegmentedControl
                value={gradeFilter}
                onChange={setGradeFilter}
                options={[
                  { key: "all", label: "All Grades" },
                  { key: "9", label: "Grade 9" },
                  { key: "10", label: "Grade 10", count: "8" },
                  { key: "11", label: "Grade 11", count: "2" },
                  { key: "12", label: "Grade 12" },
                ]}
              />

              <div className="w-36">
                <Select
                  value={sectionFilter}
                  onChange={setSectionFilter}
                  options={[
                    { value: "all", label: "All Sections" },
                    { value: "A", label: "Section A (Rm 204)" },
                    { value: "B", label: "Section B (Rm 208)" },
                    { value: "C", label: "Section C (Rm 212)" },
                  ]}
                />
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: "all", label: "All", count: totalEnrolled },
                { key: "present", label: "Present", count: presentCount },
                { key: "absent", label: "Absent", count: absentCount },
                { key: "late", label: "Late", count: lateCount },
                { key: "excused", label: "Excused", count: excusedCount },
              ].map(({ key, label, count }) => {
                const isSelected = statusFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key as any)}
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                      borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                      color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                      fontSize: `${scaled.sublabelFontSize}px`,
                      transition: scaled.transitionStyle,
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-semibold cursor-pointer shadow-2xs hover:opacity-90"
                  >
                    <span>{label}</span>
                    <span
                      style={{
                        backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : tokens.hoverBackplateTint,
                        color: isSelected ? scaled.primaryActionTextColor : "#71717A",
                      }}
                      className="text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold"
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
                placeholder="Search student by name, roll number (e.g. STU-1024), or parent contact..."
              />
            </div>
            <Button
              variant="outline"
              size="md"
              iconLeft={<CheckCircle2 />}
              onClick={() => {
                setStudents((prev) => prev.map((s) => ({ ...s, status: "present", checkInTime: "08:15 AM" })));
                showToast("Marked all students as Present");
              }}
            >
              Mark All Present
            </Button>
          </div>
        </div>

        {/* Floating Bulk Selection Toolbar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              style={{
                borderRadius: `${scaled.scaledCardRadius}px`,
                backgroundColor: "#18181B",
                borderColor: "#27272A",
              }}
              className="p-3 text-white text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xl border"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">
                  <strong className="font-bold tabular-nums">{selectedIds.length}</strong> students selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkUpdate("present")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold transition-colors cursor-pointer"
                >
                  Mark Present
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkUpdate("absent")}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-lg text-white font-semibold transition-colors cursor-pointer"
                >
                  Mark Absent
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkUpdate("excused")}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-colors cursor-pointer"
                >
                  Mark Excused
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Broadcasted guardian SMS to ${selectedIds.length} parents`);
                    setSelectedIds([]);
                  }}
                  className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Phone size={13} />
                  <span>Notify Guardians</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-neutral-400 hover:text-white px-2 py-1 font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Student Attendance Roster Table */}
        <div
          style={{
            borderRadius: `${scaled.scaledCardRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
            boxShadow: scaled.cardShadow,
          }}
          className="overflow-hidden border select-none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr
                  style={{
                    borderColor: tokens.universalBorderColor,
                    borderBottomWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                    color: tokens.textIconColor,
                  }}
                  className="border-b font-semibold"
                >
                  <th className="p-3.5 w-12 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      style={{
                        borderRadius: `${scaled.scaledCheckboxRadius}px`,
                        borderColor: selectedIds.length > 0 ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: selectedIds.length > 0 ? tokens.primaryButtonColor : tokens.universalFillColor,
                      }}
                      className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto transition-colors"
                    >
                      {selectedIds.length === filteredStudents.length && (
                        <Check size={12} strokeWidth={3} color={scaled.primaryActionTextColor} />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5 whitespace-nowrap">Student / Roll No.</th>
                  <th className="p-3.5 whitespace-nowrap">Grade &amp; Section</th>
                  <th className="p-3.5 whitespace-nowrap">Gate Time</th>
                  <th className="p-3.5 whitespace-nowrap">Attendance State</th>
                  <th className="p-3.5 whitespace-nowrap">30-Day Rate</th>
                  <th className="p-3.5 whitespace-nowrap">Guardian Contact</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: tokens.universalBorderColor }} className="divide-y divide-neutral-100">
                {pagedStudents.map((stu) => {
                  const isSelected = selectedIds.includes(stu.id);
                  return (
                    <tr
                      key={stu.id}
                      style={{
                        backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                        transition: scaled.transitionStyle,
                      }}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectRow(stu.id)}
                          style={{
                            borderRadius: `${scaled.scaledCheckboxRadius}px`,
                            borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                          }}
                          className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto transition-colors"
                        >
                          {isSelected && (
                            <Check size={12} strokeWidth={3} color={scaled.primaryActionTextColor} />
                          )}
                        </button>
                      </td>

                      {/* Student Info */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={stu.avatar}
                            initials={stu.name.split(" ").map((n) => n[0]).join("")}
                            size="sm"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => setActiveStudent(stu)}
                              style={{ color: tokens.textIconColor }}
                              className="font-bold hover:underline cursor-pointer text-left block"
                            >
                              {stu.name}
                            </button>
                            <span className="text-[11px] text-neutral-400 tabular-nums">
                              {stu.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Section */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                            color: tokens.textIconColor,
                          }}
                          className="inline-block px-2.5 py-0.5 text-[11px] font-semibold border whitespace-nowrap"
                        >
                          Grade {stu.grade}-{stu.section}
                        </span>
                      </td>

                      {/* Gate Entry Time */}
                      <td className="p-3.5 whitespace-nowrap tabular-nums text-neutral-600 font-medium">
                        {stu.checkInTime}
                      </td>

                      {/* Interactive Attendance Status Switcher */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                          }}
                          className="inline-flex items-center gap-1 p-0.5"
                        >
                          {(
                            [
                              { key: "present", label: "Present" },
                              { key: "absent", label: "Absent" },
                              { key: "late", label: "Late" },
                              { key: "excused", label: "Excused" },
                            ] as const
                          ).map(({ key, label }) => {
                            const isStateActive = stu.status === key;
                            let activeBg = tokens.primaryButtonColor;
                            let activeText = scaled.primaryActionTextColor;
                            if (key === "present") {
                              activeBg = "#059669";
                              activeText = "#FFFFFF";
                            } else if (key === "absent") {
                              activeBg = "#E11D48";
                              activeText = "#FFFFFF";
                            } else if (key === "late") {
                              activeBg = "#D97706";
                              activeText = "#FFFFFF";
                            } else if (key === "excused") {
                              activeBg = "#0284C7";
                              activeText = "#FFFFFF";
                            }

                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleUpdateStatus(stu.id, key)}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  backgroundColor: isStateActive ? activeBg : "transparent",
                                  color: isStateActive ? activeText : "#71717A",
                                  fontSize: "11px",
                                }}
                                className={`px-2.5 py-1 font-semibold cursor-pointer transition-all ${
                                  isStateActive ? "shadow-2xs" : "hover:text-neutral-900"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* 30-Day Attendance Rate */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1">
                            <ProgressBar value={stu.recentAttendanceRate} showValue={false} />
                          </div>
                          <span className="text-[11px] font-bold tabular-nums text-neutral-700">
                            {stu.recentAttendanceRate}%
                          </span>
                        </div>
                      </td>

                      {/* Guardian Contact */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="text-neutral-700 font-medium">
                          {stu.parentName}
                        </div>
                        <div className="text-[11px] text-neutral-400 tabular-nums">
                          {stu.parentPhone}
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveStudent(stu)}
                          style={{
                            borderRadius: `${scaled.scaledRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            color: tokens.textIconColor,
                          }}
                          className="px-2.5 py-1 border text-xs font-semibold hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          View Card
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div
            style={{
              borderColor: tokens.universalBorderColor,
              borderTopWidth: `${tokens.borderWidth}px`,
            }}
            className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStudents.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemNoun="students"
            />
          </div>
        </div>
      </main>

      {/* Student Attendance Detail Drawer */}
      <AnimatePresence>
        {activeStudent && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={scaled.motionConfig.drawerTransition}
              style={{
                borderColor: tokens.universalBorderColor,
                borderLeftWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
              }}
              className="w-full max-w-[440px] h-full border-l shadow-2xl flex flex-col justify-between select-none"
            >
              {/* Drawer Header */}
              <div
                style={{
                  borderColor: tokens.universalBorderColor,
                  borderBottomWidth: `${tokens.borderWidth}px`,
                }}
                className="p-5 border-b flex items-start justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={activeStudent.avatar}
                    initials={activeStudent.name.split(" ").map((n) => n[0]).join("")}
                    size="md"
                  />
                  <div>
                    <h3 style={{ color: tokens.textIconColor }} className="font-bold text-sm">
                      {activeStudent.name}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {activeStudent.rollNumber} • Grade {activeStudent.grade}-{activeStudent.section}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStudent(null)}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
                {/* Status Switcher Card */}
                <div
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                  }}
                  className="p-3.5 border space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-700">Today's Attendance</span>
                    <Badge variant={activeStudent.status === "present" ? "healthy" : activeStudent.status === "absent" ? "critical" : "degraded"}>
                      {activeStudent.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    {(["present", "absent", "late", "excused"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdateStatus(activeStudent.id, s)}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          backgroundColor: activeStudent.status === s ? tokens.primaryButtonColor : "transparent",
                          color: activeStudent.status === s ? scaled.primaryActionTextColor : tokens.textIconColor,
                          borderWidth: "1px",
                          borderColor: activeStudent.status === s ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        }}
                        className="flex-1 py-1.5 font-bold capitalize text-center cursor-pointer transition-colors text-[11px]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 30-Day Attendance Card */}
                <div
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                  }}
                  className="p-3.5 border space-y-2 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-700">Attendance Telemetry</span>
                    <span className="font-bold tabular-nums text-emerald-600">
                      {activeStudent.recentAttendanceRate}% (28 / 30 Days)
                    </span>
                  </div>
                  <ProgressBar value={activeStudent.recentAttendanceRate} showValue={false} />
                  <p className="text-[11px] text-neutral-500 pt-1">
                    Student meets the state-mandated 90% instructional attendance benchmark.
                  </p>
                </div>

                {/* Guardian Contact Info */}
                <div
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                  }}
                  className="p-3.5 border space-y-2 bg-white"
                >
                  <span className="font-semibold text-neutral-700 block">Emergency Guardian Contact</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Primary Contact:</span>
                      <strong className="text-neutral-900">{activeStudent.parentName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Phone:</span>
                      <strong className="text-neutral-900 tabular-nums">{activeStudent.parentPhone}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={<Phone />}
                      onClick={() => showToast(`Dialing guardian ${activeStudent.parentName}...`)}
                      className="flex-1"
                    >
                      Call Guardian
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={<Send />}
                      onClick={() => showToast(`Sent SMS alert to ${activeStudent.parentPhone}`)}
                      className="flex-1"
                    >
                      Send SMS
                    </Button>
                  </div>
                </div>

                {/* Teacher Observations & Notes */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-neutral-700 block">Homeroom Notes &amp; Observations</span>
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: scaled.effectiveInputFill,
                    }}
                    className="p-3 border text-neutral-600 leading-relaxed"
                  >
                    {activeStudent.notes || "No special attendance remarks recorded for this instructional period."}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div
                style={{
                  borderColor: tokens.universalBorderColor,
                  borderTopWidth: `${tokens.borderWidth}px`,
                }}
                className="p-4 border-t flex items-center justify-end gap-2 bg-neutral-50"
              >
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<X />}
                  onClick={() => setActiveStudent(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Check />}
                  onClick={() => {
                    showToast(`Saved records for ${activeStudent.name}`);
                    setActiveStudent(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Submission Confirmation Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={scaled.motionConfig.modalTransition}
              style={{
                borderRadius: `${scaled.scaledCardRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
                boxShadow: scaled.cardShadow,
              }}
              className="w-full max-w-md p-6 border shadow-2xl space-y-4 select-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: `${tokens.primaryButtonColor}15`,
                      color: tokens.primaryButtonColor,
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  >
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 style={{ color: tokens.textIconColor }} className="font-bold text-sm">
                      Submit Homeroom Attendance Register
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Period 1 • Tuesday, Nov 10, 2026
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                }}
                className="p-3 border space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Present Students:</span>
                  <strong className="text-emerald-700 tabular-nums">{presentCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Unexcused Absences:</span>
                  <strong className="text-rose-700 tabular-nums">{absentCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Tardy / Late Arrivals:</span>
                  <strong className="text-amber-700 tabular-nums">{lateCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Excused Absences:</span>
                  <strong className="text-sky-700 tabular-nums">{excusedCount}</strong>
                </div>
              </div>

              <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                By submitting this register, official attendance records will be synchronized to the school registrar and parent absence alerts will be dispatched.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Send />}
                  onClick={() => {
                    setIsSubmitted(true);
                    setIsSubmitModalOpen(false);
                    showToast("Daily register transmitted to School Registrar");
                  }}
                >
                  Confirm &amp; Transmit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SchoolAttendancePage() {
  return (
    <ZeroLightProvider tokens={SCHOOL_ATTENDANCE_TOKENS}>
      <SchoolAttendanceInner />
    </ZeroLightProvider>
  );
}
