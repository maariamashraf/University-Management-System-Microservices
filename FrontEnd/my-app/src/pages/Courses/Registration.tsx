import { useState } from "react";
import AllCourses from "../../components/Courses/AllCourses";
import { DEPARTMENT_OPTIONS } from "../../constants/departments";

export default function Registration() {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
            {/* ── Header row ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registration</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Select and register for your upcoming semester courses.
                    </p>
                </div>

                {/* Search + filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Live search input */}
                    <div className="relative flex items-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                            className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses…"
                            className="pl-9 pr-8 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {DEPARTMENT_OPTIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Course grid ── */}
            <AllCourses search={search} department={department} />
        </div>
    );
}
