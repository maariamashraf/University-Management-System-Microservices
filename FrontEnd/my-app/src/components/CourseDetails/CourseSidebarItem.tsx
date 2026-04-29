import type { LucideIcon } from "lucide-react";
import type { CourseTab } from "../../Interfaces/courseDetails";

interface CourseSidebarItemProps {
    id: CourseTab;
    label: string;
    icon: LucideIcon;
    badge?: number | string;
    badgeVariant?: "count" | "live";
    isActive: boolean;
    onClick: (tab: CourseTab) => void;
}

export default function CourseSidebarItem({
    id,
    label,
    icon: Icon,
    badge,
    badgeVariant = "count",
    isActive,
    onClick,
}: CourseSidebarItemProps) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer ${
                isActive
                    ? "bg-blue-50 text-blue-700 border-l-3 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon
                    size={16}
                    className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}
                />
                <span>{label}</span>
            </div>

            {badge !== undefined && (
                <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        badgeVariant === "live"
                            ? "bg-green-500 text-white animate-pulse"
                            : isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {badge}
                </span>
            )}
        </button>
    );
}
