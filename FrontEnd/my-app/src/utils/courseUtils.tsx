import React from "react";

/* ─── types ────────────────────────────────────────────────────── */

export type CoursePalette = {
    header: string;
    headerText: string;
    bar: string;
    pill: string;
    pillText: string;
    btn: string;
    btnHover: string;
};

/* ─── prefix extraction ─────────────────────────────────────────── */

/** Strips trailing digits from codes like "CS301" → "CS", "BUS201" → "BUS" */
export function getCoursePrefix(courseCode: string): string {
    return courseCode?.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() ?? "";
}

/* ─── palette map ───────────────────────────────────────────────── */

const DEFAULT_PALETTE: CoursePalette = {
    header:     "bg-slate-500",
    headerText: "text-slate-200",
    bar:        "bg-slate-300",
    pill:       "bg-slate-100",
    pillText:   "text-slate-600",
    btn:        "bg-slate-500",
    btnHover:   "hover:bg-slate-600",
};

const PALETTE_MAP: Record<string, CoursePalette> = {
    CS: {
        header:     "bg-indigo-500",
        headerText: "text-indigo-100",
        bar:        "bg-indigo-200",
        pill:       "bg-indigo-50",
        pillText:   "text-indigo-700",
        btn:        "bg-indigo-600",
        btnHover:   "hover:bg-indigo-700",
    },
    IT: {
        header:     "bg-teal-600",
        headerText: "text-teal-100",
        bar:        "bg-teal-200",
        pill:       "bg-teal-50",
        pillText:   "text-teal-700",
        btn:        "bg-teal-600",
        btnHover:   "hover:bg-teal-700",
    },
    CY: {
        header:     "bg-rose-600",
        headerText: "text-rose-100",
        bar:        "bg-rose-200",
        pill:       "bg-rose-50",
        pillText:   "text-rose-700",
        btn:        "bg-rose-600",
        btnHover:   "hover:bg-rose-700",
    },
    DS: {
        header:     "bg-slate-700",
        headerText: "text-slate-200",
        bar:        "bg-slate-300",
        pill:       "bg-slate-100",
        pillText:   "text-slate-700",
        btn:        "bg-slate-700",
        btnHover:   "hover:bg-slate-800",
    },
    AI: {
        header:     "bg-purple-700",
        headerText: "text-purple-100",
        bar:        "bg-purple-200",
        pill:       "bg-purple-50",
        pillText:   "text-purple-700",
        btn:        "bg-purple-700",
        btnHover:   "hover:bg-purple-800",
    },
    IS: {
        header:     "bg-sky-700",
        headerText: "text-sky-100",
        bar:        "bg-sky-200",
        pill:       "bg-sky-50",
        pillText:   "text-sky-700",
        btn:        "bg-sky-700",
        btnHover:   "hover:bg-sky-800",
    },


};

export function getCourseColor(courseCode: string): CoursePalette {
    const prefix = getCoursePrefix(courseCode);
    return PALETTE_MAP[prefix] ?? DEFAULT_PALETTE;
}

/* ─── status / capacity helpers ────────────────────────────────── */

/** Tailwind classes for an enrollment-status badge. */
export function getEnrollmentStatusColor(status: string): string {
    switch (status) {
        case "In Progress": return "bg-green-100 text-green-700 ring-1 ring-green-200";
        case "Pending":     return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
        case "Completed":   return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
        default:            return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    }
}

/** Tailwind classes for a course-capacity badge (enrolled / max). */
export function getCapacityColor(enrolled: number, max: number): string {
    const ratio = enrolled / max;
    if (ratio >= 0.9) return "bg-red-100 text-red-700";
    if (ratio >= 0.7) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
}

/* ─── date helpers ──────────────────────────────────────────────── */

export function isCompleted(endDate: string): boolean {
    return new Date() >= new Date(endDate);
}

export function formatCourseDate(dateStr: string): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/* ─── course icon ───────────────────────────────────────────────── */

const COURSE_ICONS: Record<string, React.ReactElement> = {
    CS: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    IT: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    ),
    EE: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
    ),
    ME: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    ),
    BUS: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ),
};

const FALLBACK_ICON = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

export function CourseIcon({ courseCode }: { courseCode: string }) {
    const prefix = getCoursePrefix(courseCode);
    return COURSE_ICONS[prefix] ?? FALLBACK_ICON;
}
