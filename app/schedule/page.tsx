"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_SCHEDULE_TEMPLATE } from "@/constants";
import { useWeekDates } from "@/hooks/useWeekDates";
import { WeekNavigator } from "@/components/schedule/WeekNavigator";
import { DayCard } from "@/components/schedule/DayCard";

export default function SchedulePage() {
    const [weekOffset, setWeekOffset] = useState(0);
    const router = useRouter();
    const { dates, isToday, formatDate, weekRange } = useWeekDates(weekOffset);

    const handleLessonSelect = (subject: string, group: string) => {
        const params = new URLSearchParams({ subject, group });
        router.push(`/journal?${params.toString()}`);
    };

    return (
        <div className="p-4 md:p-6 mx-auto w-full md:mb-24">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="pl-2">
                    <h2 className="text-text text-h2 drop-shadow-sm">
                        Расписание
                    </h2>
                    <p className="text-text/85 text-body">
                        Ваше расписание на неделю
                    </p>
                </div>
                <WeekNavigator
                    weekRange={weekRange}
                    onPrev={() => setWeekOffset((p) => p - 1)}
                    onNext={() => setWeekOffset((p) => p + 1)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_SCHEDULE_TEMPLATE.map((dayTemplate, index) => (
                    <DayCard
                        key={dayTemplate.dayName}
                        dayTemplate={dayTemplate}
                        date={dates[index]}
                        isActive={isToday(dates[index])}
                        formatDate={formatDate}
                        onLessonSelect={handleLessonSelect}
                    />
                ))}
            </div>
        </div>
    );
}
