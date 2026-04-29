export type CourseTab =
    | "overview"
    | "lectures"
    | "assignments"
    | "resources"
    | "grades"
    | "chat"
    | "students";

export interface CourseDetailsStats {
    lecturesDone: number;
    totalLectures: number;
    pendingTasks: number;
    avgGrade: number;
    classmates: number;
}

export interface CourseDeadlineItem {
    id: number;
    title: string;
    subtitle: string;
    eventDate: string;
    type: string;
}
