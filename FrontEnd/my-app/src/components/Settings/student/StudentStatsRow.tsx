import { BookOpen, Clock, CheckCircle, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Student } from "../../../Interfaces/student";

interface StatItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    bg: string;
}

function buildStats(student: Student): StatItem[] {
    return [
        {
            label: "Enrolled Courses",
            value: student.enrolledCoursesCount,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Total Credits",
            value: student.totalCredits,
            icon: Clock,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
        },
        {
            label: "Current GPA",
            value: student.gpa.toFixed(2),
            icon: CheckCircle,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Academic Standing",
            value: student.academicStanding,
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
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

export default function StudentStatsRow({ student }: { student: Student }) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-5">
            {buildStats(student).map(stat => (
                <StatCard key={stat.label} stat={stat} />
            ))}
        </div>
    );
}
