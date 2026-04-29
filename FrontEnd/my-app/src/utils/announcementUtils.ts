import { Clock, DollarSign, Briefcase, BookOpen, type LucideIcon } from "lucide-react";

export interface AnnouncementIconStyle {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    borderColor: string;
}

export function getAnnouncementIconAndColor(type: string): AnnouncementIconStyle {
    switch (type) {
        case "info":
            return { icon: Clock,      bgColor: "bg-blue-100",   iconColor: "text-blue-500",   borderColor: "border-blue-500"   };
        case "warning":
            return { icon: DollarSign, bgColor: "bg-yellow-100", iconColor: "text-yellow-500", borderColor: "border-yellow-500" };
        case "success":
            return { icon: Briefcase,  bgColor: "bg-green-100",  iconColor: "text-green-500",  borderColor: "border-green-500"  };
        default:
            return { icon: BookOpen,   bgColor: "bg-purple-100", iconColor: "text-purple-500", borderColor: "border-purple-500" };
    }
}
