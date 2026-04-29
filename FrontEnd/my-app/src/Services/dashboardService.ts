import type { AnnouncementResponse } from "../Interfaces/announcement";
import type { UpcomingEventResponse } from "../Interfaces/upComingEvent";
import type { EnrolledCourseResponse } from "../Interfaces/enrolledCourse";

// ─── Component display types ─────────────────────────────────────────────────

export interface DashboardCourse {
    courseCode: string;
    courseName: string;
    instructor: string;
    credits: number;
    status: "In Progress" | "Pending" | "Completed";
}

export interface DashboardAnnouncement {
    id: string;
    title: string;
    description: string;
    timeAgo: string;
    type: "info" | "warning" | "success" | "default";
}

export interface DashboardEvent {
    id: string;
    date: { month: string; day: string };
    title: string;
    subtitle: string;
    type: "High Priority" | "Exam" | "Event";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours   = Math.floor(diff / 3_600_000);
    const days    = Math.floor(diff / 86_400_000);
    const weeks   = Math.floor(days / 7);

    if (minutes < 60)  return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours   < 24)  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days    < 7)   return `${days} day${days !== 1 ? "s" : ""} ago`;
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
}

function parseEventDate(dateStr: string): { month: string; day: string } {
    const d = new Date(dateStr);
    return {
        month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        day:   String(d.getDate()),
    };
}

// ─── Transform functions ──────────────────────────────────────────────────────

export function transformAnnouncements(announcements: AnnouncementResponse[]): DashboardAnnouncement[] {
    return announcements.map(a => ({
        id:          String(a.id),
        title:       a.title,
        description: a.description,
        timeAgo:     formatTimeAgo(a.createdAt),
        type:        a.type ?? "default",
    }));
}

export function transformEvents(events: UpcomingEventResponse[]): DashboardEvent[] {
    return events.map(e => ({
        id:       String(e.id),
        title:    e.title,
        subtitle: e.description,
        date:     parseEventDate(e.date),
        type:     e.type ?? "Event",
    }));
}

export function transformEnrolledCourses(courses: EnrolledCourseResponse[]): DashboardCourse[] {
    return courses.map(c => ({
        courseCode: String(c.courseId),
        courseName: c.courseName,
        instructor: c.teacherName,
        credits:    c.credits,
        status:     c.status ?? "In Progress",
    }));
}
