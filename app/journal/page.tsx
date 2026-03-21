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
import { ChevronLeft, ChevronRight, GraduationCap, Users } from "lucide-react";

const ITEMS_PER_PAGE = 18;
const FIRST_COL_WIDTH = 200;

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
    const handleNextPage = () =>
        setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <div className="p-4 md:p-6 mx-auto w-full md:mb-24">
            {/* 1. Заголовок */}
            <div className="flex items-center self-start md:flex-row mb-4 pl-2 gap-4">
                <h1 className="text-text text-h2 drop-shadow-sm">Журнал</h1>
            </div>

            {/* 2. Область фильтров */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
                {/* Фильтры: группа + предмет */}
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
                <GlassCard className="!rounded-full" intensity="low">
                    <div className="p-1.5 rounded-full flex relative">
                        {/* Скользящий фон */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-accent rounded-full transition-all duration-300 ease-in-out ${
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

            {/* 3. Таблица успеваемости и посещаемости */}
            <GlassCard
                className="flex-1 overflow-hidden flex flex-col"
                intensity="low"
            >
                {/* 4. Таблица */}
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-20">
                            <tr>
                                <th className="p-4  backdrop-blur-xl border-b border-secondary/5 text-text/85 text-body-sm min-w-[${FIRST_COL_WIDTH}px] sticky left-0 z-30 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                                    Студент
                                </th>
                                {currentDays.map((day, i) => (
                                    <th
                                        key={i}
                                        className="p-3 backdrop-blur-lg  text-center text-secondary/85 text-caption font-medium min-w-[50px]"
                                    >
                                        <div className="flex flex-col items-center -rotate-90">
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
                                    className="hover:bg-background/50 transition-colors"
                                >
                                    <td className="p-4 text-body text-text backdrop-blur-md sticky left-0 z-20 border-r border-b border-secondary/5 ">
                                        {student.name}
                                    </td>
                                    {currentDays.map((_, relativeIndex) => {
                                        const actualIndex =
                                            startDayIndex + relativeIndex;
                                        let cellContent: React.ReactNode = "-";
                                        const isToday = actualIndex === 12; // Mock "today"

                                        if (mode === "GRADES") {
                                            const grade =
                                                student.grades[actualIndex];
                                            if (grade) {
                                                const color =
                                                    grade >= 4
                                                        ? "text-green-600 bg-green-500/20"
                                                        : grade === 3
                                                          ? "text-yellow-600 bg-yellow-500/20"
                                                          : "text-red-600 bg-red-500/20";
                                                cellContent = (
                                                    <span
                                                        className={`inline-flex text-body-sm font-medium items-center justify-center w-8 h-8 rounded-full ${color} shadow-sm border border-primary/5`}
                                                    >
                                                        {grade}
                                                    </span>
                                                );
                                            } else {
                                                cellContent = (
                                                    <span className="text-primary/50">
                                                        x
                                                    </span>
                                                );
                                            }
                                        } else {
                                            const present =
                                                student.attendance[actualIndex];
                                            if (present === true) {
                                                cellContent = (
                                                    <span className="text-primary/50">
                                                        ·
                                                    </span>
                                                );
                                            } else if (present === false) {
                                                cellContent = (
                                                    <span className="text-red-600/85 text-body-sm font-medium bg-red-500/20 px-2 py-0.5 rounded ">
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
                                                className={`p-2 text-center border-r border-secondary/5 ${isToday ? "bg-white/5" : ""}`}
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Переключатель страниц */}
                    <div className="flex items-center justify-between ml-[${FIRST_COL_WIDTH}px] p-2 backdrop-blur-md z-30">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-secondary/85 hover:bg-background/50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-body-sm font-medium hidden sm:inline">
                                Назад
                            </span>
                        </button>

                        <span className="text-body-sm font-bold text-accent/85 tracking-wide bg-background/85 px-6 py-1.5 rounded-full border border-primary/20">
                            {page + 1}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages - 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-secondary/85 hover:bg-background/50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <span className="text-body-sm font-medium hidden sm:inline">
                                Вперед
                            </span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
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
