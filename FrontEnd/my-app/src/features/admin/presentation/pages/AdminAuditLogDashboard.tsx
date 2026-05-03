import { useEffect, useMemo, useState } from "react";
import { useGetAuditLogs } from "../../../../CustomeHooks/AuditLogsHooks/UseGetAuditLogs";
import { getRole } from "../../../../Services/userService";

const PAGE_SIZE = 5;

function getDatePart(createdAt: string): string {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function formatDateTime(createdAt: string): string {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return createdAt;
    return date.toLocaleString();
}

export default function AdminAuditLogDashboard() {
    const role = getRole();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [page, setPage] = useState(1);
    const { auditLogs, isLoading, isFetching, error } = useGetAuditLogs();

    const actionOptions = useMemo(() => {
        const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)));
        return ["all", ...uniqueActions];
    }, [auditLogs]);

    const filteredLogs = useMemo(() => {
        return auditLogs.filter((log) => {
            const logDate = getDatePart(log.createdAt);
            const matchesStart = !startDate || logDate >= startDate;
            const matchesEnd = !endDate || logDate <= endDate;
            const matchesAction = actionFilter === "all" || log.action === actionFilter;
            return matchesStart && matchesEnd && matchesAction;
        });
    }, [actionFilter, auditLogs, endDate, startDate]);

    useEffect(() => {
        setPage(1);
    }, [startDate, endDate, actionFilter, auditLogs.length]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginatedLogs = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredLogs.slice(start, start + PAGE_SIZE);
    }, [filteredLogs, safePage]);

    const handleFilterChange = (nextAction: string) => {
        setActionFilter(nextAction);
        setPage(1);
    };

    const handleDateChange = (setter: (value: string) => void, value: string) => {
        setter(value);
        setPage(1);
    };

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
        <section className="min-h-full bg-slate-100 p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
                    <p className="text-sm text-slate-600">
                        Review system activities and track changes across the platform.
                    </p>
                    {isFetching && !isLoading ? (
                        <p className="text-xs text-slate-500">Refreshing logs...</p>
                    ) : null}
                </header>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="startDate">
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(event) => handleDateChange(setStartDate, event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="endDate">
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(event) => handleDateChange(setEndDate, event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="actionType">
                            Action Type
                        </label>
                        <select
                            id="actionType"
                            value={actionFilter}
                            onChange={(event) => handleFilterChange(event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            {actionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option === "all" ? "All" : option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Timestamp
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    User Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Action
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Details
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    IP Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                                        Loading audit logs...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-red-600">
                                        {error}
                                    </td>
                                </tr>
                            ) : paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                                        No audit logs found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(log.createdAt)}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{log.userName}</td>
                                        <td className="px-4 py-3 text-md text-green-700">{log.action}</td>
                                        <td className="px-4 py-3 text-md text-blue-700">{log.details || "-"}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700">{log.ipAddress}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={safePage === 1 || isLoading}
                        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {safePage} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={safePage === totalPages || isLoading}
                        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}
