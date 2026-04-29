import type { LucideIcon } from "lucide-react";

interface CoursePlaceholderTabProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function CoursePlaceholderTab({
    icon: Icon,
    title,
    description,
}: CoursePlaceholderTabProps) {
    return (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-sm text-center px-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={32} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-400 max-w-xs">{description}</p>
        </div>
    );
}
