export type UrgencyLevel = "Urgent" | "Soon" | "Upcoming" | "Exam" | "Project";

export function getUrgencyFromDaysLeft(daysLeft: number, type?: string): UrgencyLevel {
    if (type === "EXAM") return "Exam";
    if (type === "PROJECT") return "Project";
    if (daysLeft <= 3) return "Urgent";
    if (daysLeft <= 7) return "Soon";
    return "Upcoming";
}

export function getDaysLeft(eventDate: string): number {
    const now = new Date();
    const target = new Date(eventDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUrgencyStyle(urgency: UrgencyLevel): string {
    switch (urgency) {
        case "Urgent":   return "bg-red-100 text-red-700 border border-red-200";
        case "Soon":     return "bg-orange-100 text-orange-700 border border-orange-200";
        case "Exam":     return "bg-blue-100 text-blue-700 border border-blue-200";
        case "Project":  return "bg-purple-100 text-purple-700 border border-purple-200";
        default:         return "bg-gray-100 text-gray-600 border border-gray-200";
    }
}

export function getDateBoxStyle(urgency: UrgencyLevel): { bg: string; monthBg: string; dayText: string } {
    switch (urgency) {
        case "Urgent":
            return { bg: "bg-red-50", monthBg: "bg-red-500", dayText: "text-red-600" };
        case "Soon":
            return { bg: "bg-orange-50", monthBg: "bg-orange-500", dayText: "text-orange-600" };
        case "Exam":
            return { bg: "bg-blue-50", monthBg: "bg-blue-500", dayText: "text-blue-600" };
        case "Project":
            return { bg: "bg-purple-50", monthBg: "bg-purple-500", dayText: "text-purple-600" };
        default:
            return { bg: "bg-gray-50", monthBg: "bg-gray-400", dayText: "text-gray-600" };
    }
}
