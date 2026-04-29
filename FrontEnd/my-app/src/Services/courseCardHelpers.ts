export interface DeptTheme {
    header: string;
    badge: string;
    badgeText: string;
    bar: string;
}

export const DEPT_THEME: Record<string, DeptTheme> = {
    "Computer Science":        { header: "from-blue-500 to-blue-700",      badge: "bg-blue-100",    badgeText: "text-blue-700",    bar: "bg-blue-400"    },
    "Information Systems":     { header: "from-emerald-500 to-emerald-700", badge: "bg-emerald-100", badgeText: "text-emerald-700", bar: "bg-emerald-400" },
    "Software Engineering":    { header: "from-orange-500 to-orange-700",  badge: "bg-orange-100",  badgeText: "text-orange-700",  bar: "bg-orange-400"  },
    "Artificial Intelligence": { header: "from-pink-500 to-pink-700",      badge: "bg-pink-100",    badgeText: "text-pink-700",    bar: "bg-pink-400"    },
    "Data Science":            { header: "from-teal-500 to-teal-700",      badge: "bg-teal-100",    badgeText: "text-teal-700",    bar: "bg-teal-400"    },
    "Cybersecurity":           { header: "from-indigo-500 to-indigo-700",  badge: "bg-indigo-100",  badgeText: "text-indigo-700",  bar: "bg-indigo-400"  },
};

export const DEFAULT_THEME: DeptTheme = {
    header: "from-emerald-500 to-emerald-700",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-700",
    bar: "bg-emerald-400",
};

export const DEPT_ICON: Record<string, string> = {
    "Computer Science":        "💻",
    "Information Systems":     "📱",
    "Software Engineering":    "👨‍💻",
    "Artificial Intelligence": "🤖",
    "Data Science":            "📊",
    "Cybersecurity":           "🛡️",
};

export function deptLabel(dept: string): string {
    return dept.replace(/_/g, " ");
}

export function getCapacityPercent(enrolled: number, max: number): number {
    return Math.min(100, Math.round((enrolled / max) * 100));
}
