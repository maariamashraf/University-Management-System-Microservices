import type { TeacherCourse } from "./teacher";

/* ─── EnrolledCourses widget ─────────────────────────────────────── */

export interface DashboardCourse {
    courseCode: string;
    courseName: string;
    instructor: string;
    credits: number;
    status: "In Progress" | "Pending" | "Completed";
}

export interface EnrolledCoursesProps {
    courses: DashboardCourse[];
    semester?: string;
}

/* ─── RecentAnnouncements widget ─────────────────────────────────── */

export interface DashboardAnnouncement {
    id: string;
    title: string;
    description: string;
    timeAgo: string;
    type: "info" | "warning" | "success" | "default";
}

export interface RecentAnnouncementsProps {
    announcements: DashboardAnnouncement[];
}

/* ─── UpcomingEvents widget ──────────────────────────────────────── */

export interface DashboardEvent {
    id: string;
    date: {
        month: string;
        day: string;
    };
    title: string;
    subtitle: string;
    type: "High Priority" | "Exam" | "Event";
}

export interface UpcomingEventsProps {
    events: DashboardEvent[];
}

/* ─── TeachingCourses widget ─────────────────────────────────────── */

export interface TeachingCoursesProps {
    courses: TeacherCourse[];
    semester?: string;
}
