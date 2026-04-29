import { BookOpen, ClipboardCheck, TrendingUp, Users } from "lucide-react";
import type { CourseDetailsStats } from "../../Interfaces/courseDetails";

interface CourseStatsGridProps {
    stats: CourseDetailsStats;
}

interface StatItemProps {
    value: string | number;
    label: string;
    icon: React.ReactNode;
    iconBg: string;
}

function StatItem({ value, label, icon, iconBg }: StatItemProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

export default function CourseStatsGrid({ stats }: CourseStatsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatItem
                value={`${stats.lecturesDone}/${stats.totalLectures}`}
                label="Lectures Done"
                iconBg="bg-purple-100"
                icon={<BookOpen size={20} className="text-purple-600" />}
            />
            <StatItem
                value={stats.pendingTasks}
                label="Pending Tasks"
                iconBg="bg-orange-100"
                icon={<ClipboardCheck size={20} className="text-orange-600" />}
            />
            <StatItem
                value={`${stats.avgGrade}%`}
                label="Avg. Grade"
                iconBg="bg-green-100"
                icon={<TrendingUp size={20} className="text-green-600" />}
            />
            <StatItem
                value={stats.classmates}
                label="Classmates"
                iconBg="bg-blue-100"
                icon={<Users size={20} className="text-blue-600" />}
            />
        </div>
    );
}
