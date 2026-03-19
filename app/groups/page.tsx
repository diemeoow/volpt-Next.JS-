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
                <div>
                    <h2 className="text-3xl font-bold text-text">Мои группы</h2>
                    <p className="text-text/85">Список групп и предметов</p>
                </div>

                <button
                    onClick={toggleSort}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-text text-sm font-medium transition-colors"
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
                            className={`transition-all duration-500 overflow-visible ${isExpanded ? "bg-white/15" : "bg-white/10"}`}
                            intensity="medium"
                        >
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-2xl transition-all duration-300 ${isExpanded ? "bg-secondary shadow-[0_0_20px_rgba(41,125,214,0.5)]" : "bg-primary"}`}
                                    >
                                        <Users className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text">
                                            {group.name}
                                        </h3>
                                        <p className="text-sm text-text/50">
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
                                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 mt-4">
                                        Список предметов
                                    </p>
                                    <div className="grid gap-3">
                                        {group.subjects.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5"
                                            >
                                                <Book className="w-4 h-4 text-text/60" />
                                                <span className="text-text/90 font-medium">
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
