"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { MOCK_SCHEDULE_TEMPLATE, TIME_SLOTS } from "@/constants";
import { Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function SchedulePage() {
    const [weekOffset, setWeekOffset] = useState(0);
    const router = useRouter();

    // Helper to generate dates based on week offset
    const getWeekDates = (offset: number) => {
        const today = new Date();
        // Adjust to Monday of current week
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));

        // Apply offset
        monday.setDate(monday.getDate() + offset * 7);

        const dates = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push(
                d.toLocaleDateString("ru-RU", {
                    month: "short",
                    day: "numeric",
                }),
            );
        }
        return dates;
    };

    const dates = getWeekDates(weekOffset);
    const weekRange = `${dates[0]} - ${dates[dates.length - 1]}`;

    const handleLessonSelect = (subject: string, group: string) => {
        const params = new URLSearchParams();
        params.set("subject", subject);
        params.set("group", group);
        router.push(`/journal?${params.toString()}`);
    };

    return (
        <div className="p-4 md:p-6 mx-auto w-full">
            {/* Заголовок */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="pl-2">
                    <h2 className="text-3xl font-bold drop-shadow-sm">
                        Расписание
                    </h2>
                    <p className="text-text/50">Ваше расписание на неделю</p>
                </div>

                <GlassCard className="!rounded-full" intensity="low">
                    <div className=" flex items-center gap-4 p-2 px-4">
                        <button
                            onClick={() => setWeekOffset((prev) => prev - 1)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="text-text w-5 h-5" />
                        </button>
                        <span className="font-semibold text-center tracking-wide whitespace-nowrap">
                            {weekRange}
                        </span>
                        <button
                            onClick={() => setWeekOffset((prev) => prev + 1)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="text-text w-5 h-5" />
                        </button>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_SCHEDULE_TEMPLATE.map((dayTemplate, index) => (
                    <GlassCard
                        key={dayTemplate.dayName}
                        className="flex flex-col h-full !rounded-[1.5rem]"
                        intensity="medium"
                    >
                        {/* Заголовок Карточки дня */}
                        <div className="p-5 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold tracking-tight">
                                    {dayTemplate.dayName}
                                </h3>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                                    {dates[index]}
                                </span>
                            </div>
                        </div>

                        {/* Карточка предметов */}
                        <div className="p-4 space-y-3 flex-1">
                            {dayTemplate.lessons.length > 0 ? (
                                dayTemplate.lessons
                                    .sort((a, b) => a.pairNumber - b.pairNumber)
                                    .map((lesson) => {
                                        const timeSlot = TIME_SLOTS.find(
                                            (t) => t.id === lesson.pairNumber,
                                        );
                                        const timeString = timeSlot
                                            ? timeSlot.time.split(" - ")[0]
                                            : "TBA";

                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() =>
                                                    handleLessonSelect(
                                                        lesson.subject,
                                                        lesson.group,
                                                    )
                                                }
                                                className="
                          group relative overflow-hidden rounded-xl
                          bg-white/[0.05]
                          hover:bg-white/[0.1]
                          border border-background/5
                          p-3 transition-colors duration-200 cursor-pointer
                        "
                                            >
                                                <div className="absolute top-2 right-2 text-[10px] text-text/40 font-mono font-bold">
                                                    #{lesson.pairNumber}
                                                </div>

                                                <div className="flex justify-between items-start mb-2 pr-4">
                                                    <span className="font-bold text-text/90 group-hover:text-blue-300 transition-colors text-sm line-clamp-1 shadow-black/10 drop-shadow-sm">
                                                        {lesson.subject}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] font-bold bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/20 backdrop-blur-sm">
                                                        {lesson.group}
                                                    </span>
                                                    <div className="flex items-center gap-3 text-[10px] text-blue-300 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />{" "}
                                                            {timeString}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />{" "}
                                                            {lesson.room}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="h-full flex items-center justify-center text-text/20 italic text-sm min-h-[100px]">
                                    Нет предметов
                                </div>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
