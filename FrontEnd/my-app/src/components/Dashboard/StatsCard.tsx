import type  { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    valueColor?: string;
}

export default function StatsCard({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    iconBgColor = "bg-blue-100",
    iconColor = "text-blue-500",
    valueColor = "text-blue-600" 
}: StatsCardProps) {
    return (
        <div className="bg-white flex justify-between items-center px-6 rounded-xl shadow-sm h-32">
            <div className="flex flex-col items-start gap-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
                <p className={`${title=="Department" ? "text-1xl" : "text-3xl"} font-bold ${valueColor}`}>{value}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
            <div className={`w-11 h-11 ${iconBgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`${iconColor} w-5 h-5`} />
            </div>
        </div>
    );
}
