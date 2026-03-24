export interface Student {
    id: string;
    name: string;
    grades: (number | null)[]; // Array of grades
    attendance: (boolean | null)[]; // true = present, false = absent, null = future/unset
}

export interface Lesson {
    id: string;
    subject: string;
    group: string;
    room: string;
    pairNumber: number; // 1-6
}

export interface ScheduleDay {
    dayName: string; // "Monday", etc.
    date: string; // Display string like "Oct 23"
    lessons: Lesson[];
}
export interface DayTemplate {
    dayName: string;
    lessons: Lesson[];
}

export interface GroupSummary {
    id: string;
    name: string;
    subjects: string[];
}

export type ViewState = "LANDING" | "LOGIN" | "SCHEDULE" | "JOURNAL" | "GROUPS";

export type JournalMode = "GRADES" | "ATTENDANCE";

export type SortOption = "NAME" | "SUBJECTS_COUNT";

// types/journal.ts
export type AttendanceStatus = null | "НБ" | "ОП" | "УВ" | "ОТ";
export type Grade = 2 | 3 | 4 | 5 | null;
export type GradesState = Record<string, Record<number, Grade>>;
export type AttendanceState = Record<string, Record<number, AttendanceStatus>>;

export const ATTENDANCE_CYCLE: AttendanceStatus[] = [
    null,
    "НБ",
    "ОП",
    "УВ",
    "ОТ",
];

export function nextStatus(current: AttendanceStatus): AttendanceStatus {
    return ATTENDANCE_CYCLE[
        (ATTENDANCE_CYCLE.indexOf(current) + 1) % ATTENDANCE_CYCLE.length
    ];
}

export function nextGrade(g: Grade): Grade {
    if (g === null) return 2;
    if (g === 5) return null;
    return (g + 1) as Grade;
}

export function statusStyle(s: AttendanceStatus): string {
    switch (s) {
        case "НБ":
            return "bg-red-500/20 text-red-500 border-red-500/30";
        case "ОП":
            return "text-orange-400 bg-orange-500/15 border-orange-500/30";
        case "УВ":
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "ОТ":
            return "bg-purple-500/20 text-purple-400 border-purple-500/30";
        default:
            return "bg-transparent text-primary/20 border-transparent";
    }
}

export function gradeStyle(g: Grade): string {
    if (!g) return "text-primary/20";
    if (g >= 5)
        return "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    if (g === 4) return "text-green-400 bg-green-500/15 border-green-500/30";
    if (g === 3) return "text-orange-400 bg-orange-500/15 border-orange-500/30";
    return "text-red-400 bg-red-500/15 border-red-500/30";
}
