// components/journal/JournalCell.tsx
"use client";

import { JournalMode } from "@/types/types";
import {
    Grade,
    AttendanceStatus,
    gradeStyle,
    statusStyle,
} from "@/types/journal";

interface Props {
    mode: JournalMode;
    grade: Grade;
    status: AttendanceStatus;
    isToday: boolean;
    onClick: () => void;
}

export function JournalCell({ mode, grade, status, isToday, onClick }: Props) {
    const base =
        "inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold border transition-all duration-150 hover:scale-110 active:scale-95";
    const empty =
        "text-primary/15 border-transparent hover:border-primary/10 hover:text-primary/30";

    const content =
        mode === "GRADES" ? (
            <span
                className={`${base} text-sm ${grade ? gradeStyle(grade) : empty}`}
            >
                {grade ?? "·"}
            </span>
        ) : (
            <span
                className={`${base} text-[11px] ${status ? statusStyle(status) : empty}`}
            >
                {status ?? "·"}
            </span>
        );

    return (
        <td
            onClick={onClick}
            className={`py-2.5 px-1 text-center border-r border-secondary/5 cursor-pointer select-none ${isToday ? "bg-accent/5" : ""}`}
        >
            {content}
        </td>
    );
}
