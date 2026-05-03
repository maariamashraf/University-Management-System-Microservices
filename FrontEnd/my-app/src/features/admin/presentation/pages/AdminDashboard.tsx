import {
    AlertTriangleIcon,
    DatabaseIcon,
    UsersIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { getRole } from "../../../../Services/userService";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../infrastructure/services/UserService";
import { getAllCourses } from "../../../../Services/CourseService";
import { getAllAuditLogs } from "../../../../Services/AuditLogService";
import { useGetWeeklyRolesActivity } from "../../../../CustomeHooks/AuditLogsHooks/UseGetWeeklyRolesActivity";
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";

export function AdminDashboard() {
    const role = getRole();
    const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart<"line"> | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-dashboard-metrics"],
        queryFn: async () => {
            const [users, courses, auditLogs] = await Promise.all([
                userService.getAllUsers(),
                getAllCourses(),
                getAllAuditLogs(),
            ]);
            return { users, courses, auditLogs };
        },
    });
    const totalUsers = data?.users.length ?? 0;
    const activeCourses = data?.courses.length ?? 0;
    const numberOfStudents =
        data?.users.filter((user) =>
            user.roles.some((role) => role.name.toLowerCase().includes("student"))
        ).length ?? 0;
    const numberOfTeachers =
        data?.users.filter((user) =>
            user.roles.some((role) => role.name.toLowerCase().includes("teacher"))
        ).length ?? 0;
    const numberOfAdmins =
        data?.users.filter((user) =>
            user.roles.some((role) => role.name.toLowerCase().includes("admin"))
        ).length ?? 0;
    const securityIncidentLogs = useMemo(() => {
        return (data?.auditLogs ?? []).filter((log) => {
            const action = log.action.toUpperCase();
            return action.includes("DENIED") || action.includes("UNAUTHORIZED");
        });
    }, [data?.auditLogs]);

    const criticalIssues = securityIncidentLogs.length;

    const recentActions = useMemo(() => {
        return [...(data?.auditLogs ?? [])]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((log) => ({
                action: log.details?.trim().length ? log.details : log.action,
                time: new Date(log.createdAt).toLocaleString(),
            }));
    }, [data?.auditLogs]);
    const {
        chartData: weeklyRolesActivity,
        isLoading: isWeeklyActivityLoading,
        error: weeklyActivityError,
    } = useGetWeeklyRolesActivity();

    useEffect(() => {
        if (!chartCanvasRef.current) return;

        chartInstanceRef.current?.destroy();
        chartInstanceRef.current = null;

        const config: ChartConfiguration<"line"> = {
            type: "line",
            data: {
                labels: weeklyRolesActivity.labels,
                datasets: [
                    {
                        label: "Students",
                        data: weeklyRolesActivity.students,
                        borderColor: "#3b82f6",
                        backgroundColor: "rgba(59,130,246,0.12)",
                        tension: 0.35,
                        pointRadius: 3,
                        fill: false,
                    },
                    {
                        label: "Teachers",
                        data: weeklyRolesActivity.teachers,
                        borderColor: "#22c55e",
                        backgroundColor: "rgba(34,197,94,0.12)",
                        tension: 0.35,
                        pointRadius: 3,
                        fill: false,
                    },
                    {
                        label: "Admins",
                        data: weeklyRolesActivity.admins,
                        borderColor: "#f59e0b",
                        backgroundColor: "rgba(245,158,11,0.12)",
                        tension: 0.35,
                        pointRadius: 3,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            boxHeight: 8,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                        grid: {
                            color: "rgba(148,163,184,0.25)",
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        };

        chartInstanceRef.current = new Chart(chartCanvasRef.current, config);

        return () => {
            chartInstanceRef.current?.destroy();
            chartInstanceRef.current = null;
        };
    }, [weeklyRolesActivity]);

    if (role !== "admin") {
        return (
            <div className="min-h-full flex items-center justify-center bg-slate-100 p-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    You do not have permission to access this page.
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-full bg-slate-100 p-6 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard Overview</h2>
                </div>

                {isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                        Loading dashboard metrics...
                    </div>
                ) : null}

                {isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Failed to load dashboard metrics from backend.
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-slate-900">Total Users</h3>
                                <p className="text-sm text-slate-500">
                                    {numberOfStudents} Students, {numberOfTeachers} Teachers, {numberOfAdmins} Admins
                                </p>
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-slate-900">{totalUsers.toLocaleString()}</p>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                <DatabaseIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-slate-900">Active Courses</h3>
                                <p className="text-sm text-slate-500">Courses from backend</p>
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-slate-900">{activeCourses}</p>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 text-red-700">
                                <AlertTriangleIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-slate-900">Recent System Alerts</h3>
                                <p className="text-sm text-slate-500">Unauthorized/denied attempts</p>
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-slate-900">{criticalIssues} Critical Issues</p>
                    </article>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-3xl font-semibold text-slate-900">System Activity</h3>
                            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                                Last 7 days
                            </span>
                        </div>
                        <div className="h-64 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            {isWeeklyActivityLoading ? (
                                <p className="text-sm text-slate-500">Loading weekly activity...</p>
                            ) : weeklyActivityError ? (
                                <p className="text-sm text-red-600">{weeklyActivityError}</p>
                            ) : (
                                <canvas ref={chartCanvasRef} />
                            )}
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-3xl font-semibold text-slate-900">Recent Actions</h3>
                            <button
                                type="button"
                                className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                            >
                                Recent actions
                            </button>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentActions.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-3 text-sm text-slate-500" colSpan={2}>
                                                No actions available.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentActions.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700">{item.action}</td>
                                                <td className="px-4 py-3 text-sm text-slate-500">{item.time}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}