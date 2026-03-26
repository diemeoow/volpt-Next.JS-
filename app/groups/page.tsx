"use client";

import { useCallback, useMemo, useState } from "react";
import { MOCK_GROUPS } from "@/constants";
import { SortOption } from "@/types/types";
import { SortButton } from "@/components/groups/SortButton";
import { GroupCard } from "@/components/groups/GroupCard";

export default function GroupsPage() {
    const [sortBy, setSortBy] = useState<SortOption>("NAME");

    const sortedGroups = useMemo(
        () =>
            [...MOCK_GROUPS].sort((a, b) =>
                sortBy === "NAME"
                    ? a.name.localeCompare(b.name)
                    : b.subjects.length - a.subjects.length,
            ),
        [sortBy],
    );

    const handleSortToggle = useCallback(() => {
        setSortBy((p) => (p === "NAME" ? "SUBJECTS_COUNT" : "NAME"));
    }, []);

    return (
        <div className="p-4 md:p-6 mx-auto w-full mb-24">
            <div className="mb-4 flex justify-between items-center">
                <div className="pl-2">
                    <h2 className="text-text text-h2 drop-shadow-sm">
                        Мои группы
                    </h2>
                    <p className="text-text/85 text-body">
                        Список групп и предметов
                    </p>
                </div>
                <SortButton
                    sortBy={sortBy}
                    onToggle={handleSortToggle}
                />
            </div>

            <div className="space-y-5">
                {sortedGroups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
}
