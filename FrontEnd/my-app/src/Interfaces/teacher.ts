import type { AnnouncementResponse } from "./announcement";
import type { UpcomingEventResponse } from "./upComingEvent";

export interface TeacherCourse {
    id: number;
    name: string;
    description: string;
    departmentName: string;
    teacherUserName: string;
    creditHours: number;
    maxStudents: number;
    enrolledStudents: number;
}

export interface Teacher {
    role: "teacher";
    teacherId: number;
    name: string;
    email: string;
    salary: number;
    department: string;
    roles: string[];
    courses: TeacherCourse[];
    announcements: AnnouncementResponse[];
    upcomingEvents: UpcomingEventResponse[];
    coursesCount: number;
    numberOfStudents: number;
}
