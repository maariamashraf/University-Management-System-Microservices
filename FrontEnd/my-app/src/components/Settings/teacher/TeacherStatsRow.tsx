import { BookOpen, Users, Award, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Teacher } from "../../../Interfaces/teacher";

interface StatItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    bg: string;
}

function buildStats(teacher: Teacher): StatItem[] {
    return [
        {
            label: "Courses Teaching",
            value: teacher.coursesCount,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Total Students",
            value: teacher.numberOfStudents,
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Department",
            value: teacher.department,
            icon: Award,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
        {
            label: "Office Hours/wk",
            value: "6h",
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];
}

function StatCard({ stat }: { stat: StatItem }) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
                <p className={`text-lg font-bold ${stat.color} truncate`}>{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
        </div>
    );
}

export default function TeacherStatsRow({ teacher }: { teacher: Teacher }) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-5">
            {buildStats(teacher).map(stat => (
                <StatCard key={stat.label} stat={stat} />
            ))}
        </div>
    );
}
