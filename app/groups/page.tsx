"use client";

import React, { useState } from "react";
import GlassCard from "@/components/GlassCard";
import { MOCK_GROUPS } from "@/constants";
import { ChevronDown, Users, Book, ArrowDownAZ, SortAsc } from "lucide-react";
import { SortOption } from "@/types";

export default function GroupsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("NAME");

    const toggleGroup = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

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
        <div className="p-4 md:p-6 mx-auto w-full">
            <div className="mb-8 pl-2 flex justify-between items-end">
                <div className="pl-2">
                    <h2 className="text-text text-h2 drop-shadow-sm">
                        Мои группы
                    </h2>
                    <p className="text-text/85 text-body">
                        Список групп и предметов
                    </p>
                </div>

                <button
                    onClick={toggleSort}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-secondary/10 border hover:border-accent/55 hover:text-accent text-text text-body-sm font-medium transition-colors"
                >
                    {sortBy === "NAME" ? (
                        <ArrowDownAZ className="w-4 h-4" />
                    ) : (
                        <SortAsc className="w-4 h-4" />
                    )}
                    {sortBy === "NAME" ? "Имя" : "Кол-во предметов"}
                </button>
            </div>

            <div className="space-y-4">
                {sortedGroups.map((group) => {
                    const isExpanded = expandedId === group.id;
                    return (
                        <GlassCard
                            key={group.id}
                            className={`transition-all duration-500 overflow-visible`}
                            intensity="medium"
                        >
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-2xl transition-all duration-300 ${isExpanded ? "bg-secondary/50 shadow-[0_0_20px_rgba(41,125,214,0.5)]" : "bg-primary/50"}`}
                                    >
                                        <Users className="w-6 h-6 text-text" />
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

                                <ChevronDown
                                    className={`w-6 h-6 text-text/70 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Аккордион */}
                            <div
                                className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <div className="p-6 pt-0 border-t border-white/10">
                                    <p className="text-caption text-text/60 uppercase tracking-wider pl-1.5 mb-3 mt-4">
                                        Список предметов
                                    </p>
                                    <div className="grid gap-3">
                                        {group.subjects.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/5"
                                            >
                                                <Book className="w-4 h-4 text-secondary/85" />
                                                <span className="text-text text-h6">
                                                    {sub}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
