"use client";

import React, { useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { MOCK_STUDENTS, MOCK_GROUPS, ALL_SUBJECTS } from "@/constants";
import { JournalMode } from "@/types";
import { ChevronLeft, ChevronRight, GraduationCap, Users } from "lucide-react";

const ITEMS_PER_PAGE = 18;

function generateJournalDays(): { label: string; fullDate: Date }[] {
    const days: { label: string; fullDate: Date }[] = [];
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    start.setDate(1);
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    const cur = new Date(start);
    while (cur <= end) {
        if (cur.getDay() !== 0) {
            days.push({
                label: `${cur.getDate().toString().padStart(2, "0")}.${(cur.getMonth() + 1).toString().padStart(2, "0")}`,
                fullDate: new Date(cur),
            });
        }
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

const JOURNAL_DAYS = generateJournalDays();

const todayStr = (() => {
    const t = new Date();
    return `${t.getDate().toString().padStart(2, "0")}.${(t.getMonth() + 1).toString().padStart(2, "0")}`;
})();
const TODAY_INDEX = JOURNAL_DAYS.findIndex((d) => d.label === todayStr);

type AttendanceStatus = null | "НБ" | "ОП" | "УВ" | "ОТ";
const ATTENDANCE_CYCLE: AttendanceStatus[] = [null, "НБ", "ОП", "УВ", "ОТ"];

function nextStatus(current: AttendanceStatus): AttendanceStatus {
    return ATTENDANCE_CYCLE[
        (ATTENDANCE_CYCLE.indexOf(current) + 1) % ATTENDANCE_CYCLE.length
    ];
}

function statusStyle(s: AttendanceStatus): string {
    switch (s) {
        case "НБ":
            return "bg-red-500/20 text-red-500 border-red-500/30";
        case "ОП":
            return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        case "УВ":
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "ОТ":
            return "bg-purple-500/20 text-purple-400 border-purple-500/30";
        default:
            return "bg-transparent text-primary/20 border-transparent";
    }
}

type Grade = 1 | 2 | 3 | 4 | 5 | null;

function gradeStyle(g: Grade): string {
    if (!g) return "text-primary/20";
    if (g >= 5)
        return "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    if (g === 4) return "text-green-400 bg-green-500/15 border-green-500/30";
    if (g === 3) return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";
    if (g === 2) return "text-orange-400 bg-orange-500/15 border-orange-500/30";
    return "text-red-400 bg-red-500/15 border-red-500/30";
}

function nextGrade(g: Grade): Grade {
    if (g === null) return 1;
    if (g === 5) return null;
    return (g + 1) as Grade;
}

type GradesState = Record<string, Record<number, Grade>>;
type AttendanceState = Record<string, Record<number, AttendanceStatus>>;

function JournalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialGroup = searchParams.get("group") || MOCK_GROUPS[0].name;
    const initialSubject = searchParams.get("subject") || ALL_SUBJECTS[0];

    const [mode, setMode] = useState<JournalMode>("ATTENDANCE");
    const [selectedGroup, setSelectedGroup] = useState(initialGroup);
    const [selectedSubject, setSelectedSubject] = useState(initialSubject);
    const [page, setPage] = useState(() =>
        TODAY_INDEX >= 0 ? Math.floor(TODAY_INDEX / ITEMS_PER_PAGE) : 0,
    );
    const [grades, setGrades] = useState<GradesState>({});
    const [attendance, setAttendance] = useState<AttendanceState>({});

    const totalPages = Math.ceil(JOURNAL_DAYS.length / ITEMS_PER_PAGE);
    const startDayIndex = page * ITEMS_PER_PAGE;
    const currentDays = JOURNAL_DAYS.slice(
        startDayIndex,
        startDayIndex + ITEMS_PER_PAGE,
    );

    const updateFilters = (group: string, subject: string) => {
        setSelectedGroup(group);
        setSelectedSubject(subject);
        const params = new URLSearchParams();
        params.set("group", group);
        params.set("subject", subject);
        router.replace(`/journal?${params.toString()}`);
    };

    const handleGradeClick = useCallback(
        (studentId: string, dayIdx: number) => {
            setGrades((prev) => {
                const sg = prev[studentId] || {};
                return {
                    ...prev,
                    [studentId]: {
                        ...sg,
                        [dayIdx]: nextGrade(sg[dayIdx] ?? null),
                    },
                };
            });
        },
        [],
    );

    const handleAttendanceClick = useCallback(
        (studentId: string, dayIdx: number) => {
            setAttendance((prev) => {
                const sa = prev[studentId] || {};
                return {
                    ...prev,
                    [studentId]: {
                        ...sa,
                        [dayIdx]: nextStatus(sa[dayIdx] ?? null),
                    },
                };
            });
        },
        [],
    );

    return (
        <div className="flex flex-col md:mb-24 p-4 md:p-6 gap-4 overflow-hidden">
            {/* ── Заголовок ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-shrink-0 flex-wrap">
                <h1 className="text-text text-h2 drop-shadow-sm">Журнал</h1>
                {/* Бейдж с truncate при длинном названии предмета */}
                <span
                    className="text-xs font-mono text-accent/85 bg-accent/30 px-2.5 py-1 rounded-full border border-accent/50 truncate max-w-[180px] sm:max-w-xs"
                    title={`${selectedSubject} · ${selectedGroup}`}
                >
                    {selectedSubject} · {selectedGroup}
                </span>
            </div>

            {/* ── Фильтры ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 flex-shrink-0 sm:flex-row sm:items-end sm:flex-wrap sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-caption font-semibold text-primary/65 uppercase tracking-wider px-2">
                            Группа
                        </label>
                        <div className="relative">
                            <select
                                value={selectedGroup}
                                onChange={(e) =>
                                    updateFilters(
                                        e.target.value,
                                        selectedSubject,
                                    )
                                }
                                className="w-full sm:w-48 appearance-none bg-primary/5 hover:bg-secondary/15 border border-primary/10 rounded-full px-4 py-2.5 pr-9 outline-none focus:ring-1 focus:ring-accent/85 hover:border-accent/85 transition-colors cursor-pointer text-sm"
                            >
                                {MOCK_GROUPS.map((g) => (
                                    <option key={g.id} value={g.name}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-text/50 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-caption font-semibold text-primary/65 uppercase tracking-wider px-2">
                            Предмет
                        </label>
                        <div className="relative">
                            <select
                                value={selectedSubject}
                                onChange={(e) =>
                                    updateFilters(selectedGroup, e.target.value)
                                }
                                className="w-full sm:w-64 appearance-none bg-primary/5 hover:bg-secondary/15 border border-primary/10 rounded-full px-4 py-2.5 pr-9 outline-none focus:ring-1 focus:ring-accent/85 hover:border-accent/85 transition-colors cursor-pointer text-sm"
                            >
                                {ALL_SUBJECTS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-text/50 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Переключатель режима */}
                <GlassCard
                    className="!rounded-full self-start sm:self-auto"
                    intensity="low"
                >
                    <div className="p-1.5 rounded-full flex relative">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-9px)] bg-accent rounded-full transition-all duration-300 ease-in-out ${
                                mode === "GRADES"
                                    ? "left-1.5 translate-x-0"
                                    : "left-[calc(50%+4px)] translate-x-0"
                            }`}
                        />
                        <button
                            onClick={() => setMode("GRADES")}
                            className={`flex-1 min-w-[130px] py-2 px-4 rounded-full relative z-10 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${
                                mode === "GRADES"
                                    ? "text-background"
                                    : "text-primary/85"
                            }`}
                        >
                            <GraduationCap className="w-4 h-4 shrink-0" />
                            Успеваемость
                        </button>
                        <button
                            onClick={() => setMode("ATTENDANCE")}
                            className={`flex-1 min-w-[130px] py-2 px-4 rounded-full relative z-10 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${
                                mode === "ATTENDANCE"
                                    ? "text-background"
                                    : "text-primary/85"
                            }`}
                        >
                            <Users className="w-4 h-4 shrink-0" />
                            Посещаемость
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* ── Таблица ───────────────────────────────────────────────── */}
            <GlassCard
                className="flex-1 overflow-hidden flex flex-col min-h-0"
                intensity="low"
            >
                {/* Скролл — только область со студентами растягивается */}
                <div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
                    <table
                        className="w-full text-left border-collapse"
                        style={{
                            minWidth: `${200 + currentDays.length * 52}px`,
                        }}
                    >
                        <thead className="sticky top-0 z-20">
                            <tr>
                                {/* Студент — sticky left */}
                                <th className="p-3 backdrop-blur-xl border-b border-r border-secondary/5 text-text/85 text-sm font-semibold sticky left-0 z-30 shadow-[4px_0_12px_rgba(0,0,0,0.08)] min-w-[160px] md:min-w-[200px]">
                                    Студент
                                </th>
                                {/* Даты сверху */}
                                {currentDays.map((day, i) => {
                                    const isToday = day.label === todayStr;
                                    const isSat = day.fullDate.getDay() === 6;
                                    return (
                                        <th
                                            key={i}
                                            className={`p-2 backdrop-blur-xl border-b border-secondary/5 text-center align-bottom min-w-[46px] max-w-[52px] ${isToday ? "bg-accent/10" : ""}`}
                                        >
                                            <div className="flex flex-col items-center justify-end gap-0.5 h-14">
                                                <span
                                                    className={`text-[10px] font-medium ${
                                                        isToday
                                                            ? "text-accent font-bold"
                                                            : isSat
                                                              ? "text-secondary/50"
                                                              : "text-secondary/70"
                                                    }`}
                                                    style={{
                                                        writingMode:
                                                            "vertical-rl",
                                                        transform:
                                                            "rotate(180deg)",
                                                    }}
                                                >
                                                    {day.label}
                                                </span>
                                                {isToday && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5 shrink-0" />
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {MOCK_STUDENTS.map((student) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-background/40 transition-colors group"
                                >
                                    {/* Имя — sticky left */}
                                    <td className="p-3 text-sm text-text sticky left-0 z-10 border-r border-b border-secondary/5 backdrop-blur-md shadow-[4px_0_12px_rgba(0,0,0,0.05)] group-hover:bg-background/60 transition-colors whitespace-nowrap">
                                        {student.name}
                                    </td>

                                    {/* Ячейки */}
                                    {currentDays.map((day, relIdx) => {
                                        const actualIdx =
                                            startDayIndex + relIdx;
                                        const isToday = day.label === todayStr;

                                        if (mode === "GRADES") {
                                            const grade: Grade =
                                                grades[student.id]?.[
                                                    actualIdx
                                                ] ?? null;
                                            return (
                                                <td
                                                    key={actualIdx}
                                                    onClick={() =>
                                                        handleGradeClick(
                                                            student.id,
                                                            actualIdx,
                                                        )
                                                    }
                                                    className={`p-1 text-center border-r border-secondary/5 cursor-pointer select-none ${isToday ? "bg-accent/5" : ""}`}
                                                >
                                                    <span
                                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border transition-all duration-150 hover:scale-110 active:scale-95 ${
                                                            grade
                                                                ? gradeStyle(
                                                                      grade,
                                                                  )
                                                                : "text-primary/15 border-transparent hover:border-primary/10 hover:text-primary/30"
                                                        }`}
                                                    >
                                                        {grade ?? "·"}
                                                    </span>
                                                </td>
                                            );
                                        } else {
                                            const status: AttendanceStatus =
                                                attendance[student.id]?.[
                                                    actualIdx
                                                ] ?? null;
                                            return (
                                                <td
                                                    key={actualIdx}
                                                    onClick={() =>
                                                        handleAttendanceClick(
                                                            student.id,
                                                            actualIdx,
                                                        )
                                                    }
                                                    className={`p-1 text-center border-r border-secondary/5 cursor-pointer select-none ${isToday ? "bg-accent/5" : ""}`}
                                                >
                                                    <span
                                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold border transition-all duration-150 hover:scale-110 active:scale-95 ${
                                                            status
                                                                ? statusStyle(
                                                                      status,
                                                                  )
                                                                : "text-primary/15 border-transparent hover:border-primary/10 hover:text-primary/30"
                                                        }`}
                                                    >
                                                        {status ?? "·"}
                                                    </span>
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Пагинация — flex-shrink-0, не растягивается ──────── */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-secondary/5 backdrop-blur-md">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary/85 hover:bg-background/50 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">
                            Назад
                        </span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-primary/40 hidden sm:inline">
                            {currentDays[0]?.label} —{" "}
                            {currentDays[currentDays.length - 1]?.label}
                        </span>
                        <span className="text-sm font-bold text-accent/85 bg-background/85 px-4 py-1 rounded-full border border-primary/15">
                            {page + 1} / {totalPages}
                        </span>
                    </div>

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary/85 hover:bg-background/50 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
                    >
                        <span className="hidden sm:inline font-medium">
                            Вперёд
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

export default function JournalPage() {
    return (
        <Suspense
            fallback={<div className="p-6 text-text">Загрузка журнала...</div>}
        >
            <JournalContent />
        </Suspense>
    );
}
