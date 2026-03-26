import {
    ALL_SUBJECTS,
    MOCK_GROUPS,
    MOCK_SCHEDULE_TEMPLATE,
    MOCK_STUDENTS,
} from "@/constants";
import type { DayTemplate, GroupSummary, Student } from "@/types/types";

export function getGroups(): ReadonlyArray<GroupSummary> {
    return MOCK_GROUPS;
}

export function getSubjects(): ReadonlyArray<string> {
    return ALL_SUBJECTS;
}

export function getStudents(): ReadonlyArray<Student> {
    return MOCK_STUDENTS;
}

export function getScheduleTemplate(): ReadonlyArray<DayTemplate> {
    return MOCK_SCHEDULE_TEMPLATE;
}

export function isKnownGroup(group: string): boolean {
    return getGroups().some((item) => item.name === group);
}

export function isKnownSubject(subject: string): boolean {
    return getSubjects().includes(subject);
}

export function getDefaultJournalFilters() {
    return {
        group: getGroups()[0]?.name ?? "",
        subject: getSubjects()[0] ?? "",
    };
}
