import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    FolderOpen,
    GraduationCap,
    MessageSquare,
    Users,
    User,
    Clock,
    MapPin,
} from "lucide-react";
import CourseSidebarItem from "./CourseSidebarItem";
import type { CourseTab } from "../../Interfaces/courseDetails";
import type { course } from "../../Interfaces/course";
import type { CourseSidebar } from "../../Interfaces/course";
interface CourseSidebarProps {
    activeTab: CourseTab;
    onTabChange: (tab: CourseTab) => void;
    course: CourseSidebar;
    enrolledCount: number;
}

const NAV_ITEMS = [
    { id: "overview" as CourseTab,     label: "Overview",     icon: LayoutDashboard },
    { id: "lectures" as CourseTab,     label: "Lectures",     icon: BookOpen,         badge: "8/12" },
    { id: "assignments" as CourseTab,  label: "Assignments",  icon: ClipboardList,    badge: 3 },
    { id: "resources" as CourseTab,    label: "Resources",    icon: FolderOpen },
    { id: "grades" as CourseTab,       label: "Grades",       icon: GraduationCap },
    { id: "chat" as CourseTab,         label: "Course Chat",  icon: MessageSquare,    badge: "Live", badgeVariant: "live" as const },
    { id: "students" as CourseTab,     label: "Students",     icon: Users },
] as const;

export default function CourseSidebar({ activeTab, onTabChange, course }: CourseSidebarProps) {
   console.log("course in the sidebar", course);
    return (
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-4 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Course Menu
                </p>

                <nav className="space-y-0.5">
                    {NAV_ITEMS.map((item) => (
                        <CourseSidebarItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            badge={"badge" in item ? item.badge : undefined}
                            badgeVariant={"badgeVariant" in item ? item.badgeVariant : "count"}
                            isActive={activeTab === item.id}
                            onClick={onTabChange}
                        />
                    ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                        Info
                    </p>

                    <div className="space-y-3 px-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User size={13} className="text-gray-400 shrink-0" />
                            <span className="text-sm font-medium truncate">{course.teacherUserName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <BookOpen size={13} className="text-gray-400 shrink-0" />
                            <span className="text-sm font-medium truncate">{course.courseCode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock size={13} className="text-gray-400 shrink-0" />
                            <span className="text-sm font-medium truncate">{course.creditHours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock size={13} className="text-gray-400 shrink-0" />
                            <span>Mon, Wed · 10:00 AM</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin size={13} className="text-gray-400 shrink-0" />
                            <span>Hall B · Room 204</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
