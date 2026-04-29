import type { EnrolledCourseResponse } from "./enrolledCourse";
import type { AnnouncementResponse } from "./announcement";
import type { UpcomingEventResponse } from "./upComingEvent";

export interface Student {
    role: "student";
    id: number;
    username: string;
    email: string;
    gpa: number;
    totalCredits: number;
    enrolledCourses: EnrolledCourseResponse[];
    enrolledCoursesCount: number;
    enrollmentYear: number;
    academicStanding: string;
    announcements: AnnouncementResponse[];
    upcomingEvents: UpcomingEventResponse[];
}
