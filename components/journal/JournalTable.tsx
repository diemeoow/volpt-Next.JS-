// components/journal/JournalTable.tsx
"use client";

import { JournalMode } from "@/types";
import { JournalDay, todayStr } from "@/hooks/useJournalDays";
import { JournalCell } from "./JournalCell";
import { GradesState, AttendanceState } from "@/types";

interface Student {
    id: string;
    name: string;
}

interface Props {
    mode: JournalMode;
    students: Student[];
    currentDays: JournalDay[];
    startDayIndex: number;
    grades: GradesState;
    attendance: AttendanceState;
    onGradeClick: (studentId: string, dayIdx: number) => void;
    onAttendanceClick: (studentId: string, dayIdx: number) => void;
}

export function JournalTable({
    mode,
    students,
    currentDays,
    startDayIndex,
    grades,
    attendance,
    onGradeClick,
    onAttendanceClick,
}: Props) {
    return (
        <table
            className="w-full text-left border-collapse"
            style={{ minWidth: `${200 + currentDays.length * 56}px` }}
        >
            <thead className="sticky top-0 z-20">
                <tr>
                    <th className="p-3 backdrop-blur-2xl bg-background/60 border-b border-r border-secondary/5 text-text/85 text-h6 font-semibold sticky left-0 z-30 shadow-[4px_0_16px_rgba(0,0,0,0.12)] min-w-[120px] md:min-w-[200px]">
                        Студент
                    </th>
                    {currentDays.map((day, i) => {
                        const isToday = day.label === todayStr;
                        const isSat = day.fullDate.getDay() === 6;
                        return (
                            <th
                                key={i}
                                className={`p-2 backdrop-blur-2xl bg-background/60 border-b border-secondary/5 text-center align-bottom min-w-[50px] sm:min-w-[56px] max-w-[60px] ${isToday ? "bg-accent/10" : ""}`}
                            >
                                <div className="flex flex-col items-center justify-end gap-0.5 h-14">
                                    <span
                                        className={`text-caption font-medium ${
                                            isToday
                                                ? "text-accent font-bold"
                                                : isSat
                                                  ? "text-secondary/50"
                                                  : "text-secondary/70"
                                        }`}
                                        style={{
                                            writingMode: "vertical-rl",
                                            transform: "rotate(180deg)",
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
                {students.map((student) => (
                    <tr
                        key={student.id}
                        className="hover:bg-background/40 transition-colors group"
                    >
                        <td className="py-2.5 px-3 text-body text-text sticky left-0 z-10 border-r border-b border-secondary/5 backdrop-blur-2xl bg-background/50 shadow-[4px_0_16px_rgba(0,0,0,0.08)] group-hover:bg-background/70 transition-colors">
                            <span className="block max-w-[110px] md:max-w-none truncate md:whitespace-nowrap">
                                {student.name}
                            </span>
                        </td>
                        {currentDays.map((day, relIdx) => {
                            const actualIdx = startDayIndex + relIdx;
                            const isToday = day.label === todayStr;
                            return (
                                <JournalCell
                                    key={actualIdx}
                                    mode={mode}
                                    grade={
                                        grades[student.id]?.[actualIdx] ?? null
                                    }
                                    status={
                                        attendance[student.id]?.[actualIdx] ??
                                        null
                                    }
                                    isToday={isToday}
                                    onClick={() =>
                                        mode === "GRADES"
                                            ? onGradeClick(
                                                  student.id,
                                                  actualIdx,
                                              )
                                            : onAttendanceClick(
                                                  student.id,
                                                  actualIdx,
                                              )
                                    }
                                />
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
