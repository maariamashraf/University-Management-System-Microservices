import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import NotificationBell from "../common/NotificationBell";
import { getSemesterLabel } from "../../utils/dateUtils";
import { getAvatarInitials } from "../../utils/avatarUtils";
import type { course } from "../../Interfaces/course";

interface CourseHeaderProps {
    course: course;
    displayName: string;
    role: string;
}

export default function CourseHeader({ course, displayName, role }: CourseHeaderProps) {
    const initial = getAvatarInitials(displayName);
    const semester = getSemesterLabel();

    return (
        <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-2 min-w-0">
                <Link
                    to="/dashboard/Courses"
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                    My Courses
                </Link>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">
                    {course.courseCode} · {course.credits} CREDITS
                </span>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800 truncate">{course.name}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    {semester}
                </span>

                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                    <NotificationBell />
                </button>

                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs select-none">
                        {initial}
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
