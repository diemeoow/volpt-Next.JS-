"use client";

import React, { useState } from "react";
import GlassCard from "@/components/GlassCard";
import { MOCK_GROUPS } from "@/constants";
import Link from "next/link";
import { Users, Book, ArrowDownAZ, SortAsc } from "lucide-react";
import { SortOption } from "@/types/types";

export default function GroupsPage() {
    const [sortBy, setSortBy] = useState<SortOption>("NAME");

    const sortedGroups = [...MOCK_GROUPS].sort((a, b) => {
        if (sortBy === "NAME") {
            return a.name.localeCompare(b.name);
        } else {
            return b.subjects.length - a.subjects.length;
        }
    });

    const toggleSort = () => {
        setSortBy((prev) => (prev === "NAME" ? "SUBJECTS_COUNT" : "NAME"));
    };

    return (
        <div className="p-4 md:p-6 mx-auto w-full  mb-24">
            <div className="mb-4 flex justify-between items-center">
                <div className="pl-2">
                    <h2 className="text-text text-h2 drop-shadow-sm">
                        Мои группы
                    </h2>
                    <p className="text-text/85 text-body">
                        Список групп и предметов
                    </p>
                </div>
                <GlassCard
                    intensity="low"
                    className="w-fit group  hover:bg-primary/10 border px-4 py-2 border-primary/5 hover:border-accent/55 transition-colors"
                >
                    <button
                        onClick={toggleSort}
                        className="flex items-center gap-2  group-hover:text-accent text-text text-body-sm font-medium transition-colors"
                    >
                        {sortBy === "NAME" ? (
                            <ArrowDownAZ className="w-4 h-4" />
                        ) : (
                            <SortAsc className="w-4 h-4" />
                        )}
                        {sortBy === "NAME" ? "Имя" : "Кол-во предметов"}
                    </button>
                </GlassCard>
            </div>

            <div className="space-y-5">
                {sortedGroups.map((group) => {
                    return (
                        <GlassCard
                            key={group.id}
                            className={`transition-all overflow-visible`}
                            intensity="medium"
                        >
                            <div className="w-full p-6 flex items-center justify-between text-left">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-2xl transition-all duration-300 bg-accent/85`}
                                    >
                                        <Users className="w-6 h-6 text-background" />
                                    </div>
                                    <div>
                                        <h3 className="text-h4 text-text">
                                            {group.name}
                                        </h3>
                                        <p className="text-body-sm text-text/50">
                                            {group.subjects.length} предмета
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 border-t border-white/10">
                                <p className="text-caption text-text/60 uppercase tracking-wider pl-1.5 mb-3 mt-4">
                                    Список предметов
                                </p>
                                <div className="grid gap-3">
                                    {group.subjects.map((sub, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/journal?${new URLSearchParams({ group: group.name, subject: sub }).toString()}`}
                                            className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/5 hover:bg-accent/15 hover:border-accent/30"
                                        >
                                            <Book className="w-4 h-4 text-secondary/85" />
                                            <span className="text-text text-h6">
                                                {sub}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
