export interface UpcomingEventResponse {
    id: number;
    title: string;
    description: string;
    date: string;
    type?: "High Priority" | "Exam" | "Event";
}
