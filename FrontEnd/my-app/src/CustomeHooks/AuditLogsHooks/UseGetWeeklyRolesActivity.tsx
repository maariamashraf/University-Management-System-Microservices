import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getLastWeekAdminsLogs,
    getLastWeekStudentsLogs,
    getLastWeekTeachersLogs,
} from "../../Services/AuditLogService";
import type { AuditLog } from "../../Interfaces/auditLog";

type WeeklyRolesActivity = {
    labels: string[];
    students: number[];
    teachers: number[];
    admins: number[];
};

function formatDayLabel(date: Date): string {
    return date.toLocaleDateString(undefined, { weekday: "short" });
}

function toDayKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function countByDay(logs: AuditLog[], dayKeys: string[]): number[] {
    const countsByDay = new Map<string, number>();
    for (const log of logs) {
        const date = new Date(log.createdAt);
        if (Number.isNaN(date.getTime())) continue;
        const key = toDayKey(date);
        countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
    }

    return dayKeys.map((key) => countsByDay.get(key) ?? 0);
}

function getLast7Days(): { labels: string[]; dayKeys: string[] } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    for (let i = 6; i >= 0; i -= 1) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        days.push(day);
    }

    return {
        labels: days.map(formatDayLabel),
        dayKeys: days.map(toDayKey),
    };
}

export function useGetWeeklyRolesActivity() {
    const { data, isLoading, error, isFetching } = useQuery<
        { studentsLogs: AuditLog[]; teachersLogs: AuditLog[]; adminsLogs: AuditLog[] },
        Error
    >({
        queryKey: ["weekly-roles-activity"],
        queryFn: async () => {
            const [studentsLogs, teachersLogs, adminsLogs] = await Promise.all([
                getLastWeekStudentsLogs(),
                getLastWeekTeachersLogs(),
                getLastWeekAdminsLogs(),
            ]);

            return { studentsLogs, teachersLogs, adminsLogs };
        },
    });

    const chartData = useMemo<WeeklyRolesActivity>(() => {
        const { labels, dayKeys } = getLast7Days();

        return {
            labels,
            students: countByDay(data?.studentsLogs ?? [], dayKeys),
            teachers: countByDay(data?.teachersLogs ?? [], dayKeys),
            admins: countByDay(data?.adminsLogs ?? [], dayKeys),
        };
    }, [data]);

    return {
        chartData,
        isLoading,
        isFetching,
        error: error instanceof Error ? error.message : null,
    };
}
