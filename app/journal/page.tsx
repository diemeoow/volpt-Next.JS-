"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import {
  MOCK_STUDENTS,
  JOURNAL_DAYS,
  MOCK_GROUPS,
  ALL_SUBJECTS,
} from "@/constants";
import { JournalMode } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  ArrowLeft,
} from "lucide-react";

const ITEMS_PER_PAGE = 18;

function JournalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL or defaults
  const initialGroup = searchParams.get("group") || MOCK_GROUPS[0].name;
  const initialSubject = searchParams.get("subject") || ALL_SUBJECTS[0];

  const [mode, setMode] = useState<JournalMode>("ATTENDANCE");
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [page, setPage] = useState(0);

  // Update URL when filters change
  const updateFilters = (group: string, subject: string) => {
    setSelectedGroup(group);
    setSelectedSubject(subject);
    const params = new URLSearchParams();
    params.set("group", group);
    params.set("subject", subject);
    router.replace(`/journal?${params.toString()}`);
  };

  const totalPages = Math.ceil(JOURNAL_DAYS.length / ITEMS_PER_PAGE);
  const startDayIndex = page * ITEMS_PER_PAGE;
  const currentDays = JOURNAL_DAYS.slice(
    startDayIndex,
    startDayIndex + ITEMS_PER_PAGE,
  );

  // Calculate date range for the navigation bar
  const dateRangeLabel =
    currentDays.length > 0
      ? `${currentDays[0]} - ${currentDays[currentDays.length - 1]}`
      : "No Dates";

  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col max-w-[100vw]">
      {/* 1. Header Row: Title & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => router.push("/schedule")}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Журнал
          </h1>
        </div>

        {/* Mode Toggle */}
        <GlassCard className="!rounded-full" intensity="low">
          <div className="p-1 rounded-full flex relative w-full md:w-auto">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/20 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 ease-spring ${mode === "GRADES" ? "translate-x-0" : "translate-x-full left-1"}`}
            />
            <button
              onClick={() => setMode("GRADES")}
              className={`flex-1 md:w-32 py-2 rounded-full relative z-10 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${mode === "GRADES" ? "text-white" : "text-white/50"}`}
            >
              <GraduationCap className="w-4 h-4" /> Посещаемость
            </button>
            <button
              onClick={() => setMode("ATTENDANCE")}
              className={`flex-1 md:w-36 py-2 rounded-full relative z-10 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${mode === "ATTENDANCE" ? "text-white" : "text-white/50"}`}
            >
              <Users className="w-4 h-4" /> Успеваемость
            </button>
          </div>
        </GlassCard>
      </div>

      {/* 2. Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
            Group
          </label>
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => updateFilters(e.target.value, selectedSubject)}
              className="w-full sm:w-48 appearance-none bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-white px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer"
            >
              {MOCK_GROUPS.map((g) => (
                <option
                  key={g.id}
                  value={g.name}
                  className="bg-slate-900 text-white py-2"
                >
                  {g.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
            Subject
          </label>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => updateFilters(selectedGroup, e.target.value)}
              className="w-full sm:w-64 appearance-none bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-white px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Container with Navigation Bar */}
      <GlassCard
        className="flex-1 overflow-hidden flex flex-col"
        intensity="low"
      >
        {/* Navigation Bar (Full Width) */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-md z-30">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">
              Previous
            </span>
          </button>

          <span className="text-sm font-bold text-white tracking-wide bg-black/20 px-4 py-1.5 rounded-full border border-white/5">
            {dateRangeLabel}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <span className="text-sm font-medium hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4. The Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="p-4 bg-white/10 backdrop-blur-xl border-b border-white/10 text-white min-w-[200px] sticky left-0 z-30 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  Student Name
                </th>
                {currentDays.map((day, i) => (
                  <th
                    key={i}
                    className="p-3 bg-white/5 backdrop-blur-lg border-b border-white/10 text-center text-white/70 text-xs font-normal min-w-[50px]"
                  >
                    <div className="flex flex-col items-center">
                      <span>{day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_STUDENTS.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-medium text-white bg-white/5 backdrop-blur-md sticky left-0 z-20 border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                    {student.name}
                  </td>
                  {currentDays.map((_, relativeIndex) => {
                    const actualIndex = startDayIndex + relativeIndex;
                    let cellContent: React.ReactNode = "-";
                    const isToday = actualIndex === 12; // Mock "today"

                    if (mode === "GRADES") {
                      const grade = student.grades[actualIndex];
                      if (grade) {
                        const color =
                          grade >= 4
                            ? "text-green-300 bg-green-500/20"
                            : grade === 3
                              ? "text-yellow-200 bg-yellow-500/20"
                              : "text-red-300 bg-red-500/20";
                        cellContent = (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${color} shadow-sm border border-white/10`}
                          >
                            {grade}
                          </span>
                        );
                      } else {
                        cellContent = <span className="text-white/10">·</span>;
                      }
                    } else {
                      const present = student.attendance[actualIndex];
                      if (present === true) {
                        cellContent = (
                          <span className="text-white/10 text-xl">·</span>
                        );
                      } else if (present === false) {
                        cellContent = (
                          <span className="text-red-300 font-bold bg-red-500/10 px-2 py-0.5 rounded text-sm">
                            ABS
                          </span>
                        );
                      } else {
                        cellContent = null;
                      }
                    }

                    return (
                      <td
                        key={actualIndex}
                        className={`p-2 text-center border-r border-white/5 ${isToday ? "bg-white/5" : ""}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-white">Loading journal...</div>}
    >
      <JournalContent />
    </Suspense>
  );
}
