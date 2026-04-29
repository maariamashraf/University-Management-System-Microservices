export type EventType = "High Priority" | "Exam" | "Event";

/** Badge colour for the event type pill */
export function getEventTypeColor(type: string): string {
    switch (type) {
        case "High Priority": return "bg-red-100 text-red-700";
        case "Exam":          return "bg-blue-100 text-blue-700";
        case "Event":         return "bg-green-100 text-green-700";
        default:              return "bg-gray-100 text-gray-700";
    }
}

/** Background + border for the date box */
export function getEventDateColor(type: string): string {
    switch (type) {
        case "High Priority": return "bg-red-50 border-red-200";
        case "Exam":          return "bg-blue-50 border-blue-200";
        case "Event":         return "bg-green-50 border-green-200";
        default:              return "bg-gray-50 border-gray-200";
    }
}

/** Text colour for the day number inside the date box */
export function getEventDateTextColor(type: string): string {
    switch (type) {
        case "High Priority": return "text-red-600";
        case "Exam":          return "text-blue-600";
        case "Event":         return "text-green-600";
        default:              return "text-gray-600";
    }
}

/** Solid background for the month strip inside the date box */
export function getEventDateBgColor(type: string): string {
    switch (type) {
        case "High Priority": return "bg-red-500";
        case "Exam":          return "bg-blue-500";
        case "Event":         return "bg-green-500";
        default:              return "bg-gray-500";
    }
}
