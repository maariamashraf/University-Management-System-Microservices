import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../Services/authService";
import { getUserDashboardData } from "../Services/userService";
import type { Student } from "../Interfaces/student";
import type { Teacher, TeacherCourse } from "../Interfaces/teacher";
import {
    transformAnnouncements,
    transformEvents,
    transformEnrolledCourses,
    type DashboardCourse,
    type DashboardAnnouncement,
    type DashboardEvent,
} from "../Services/dashboardService";

// ─── Student Dashboard ──────────────────────────────────────────────────────

export interface StudentDashboardContextType {
    gpa: number | string;
    totalCredits: number | string;
    enrolledCoursesCount: number | string;
    academicStanding: string;
    courses: DashboardCourse[];
    announcements: DashboardAnnouncement[];
    events: DashboardEvent[];
    isLoading: boolean;
    isError: boolean;
}

const StudentDashboardContext = createContext<StudentDashboardContextType | undefined>(undefined);

export function StudentDashboardProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getUserDashboardData(getToken() ?? ""),
        enabled:  !!getToken(),
    });

    const student = user?.role === "student" ? (user as Student) : undefined;

    const value = useMemo<StudentDashboardContextType>(() => ({
        gpa:                  student?.gpa                ?? "0.00",
        totalCredits:         student?.totalCredits        ?? 0,
        enrolledCoursesCount: student?.enrolledCoursesCount ?? 0,
        academicStanding:     student?.academicStanding    ?? "Excellent",
        courses:              transformEnrolledCourses(student?.enrolledCourses ?? []),
        announcements:        transformAnnouncements(student?.announcements ?? []),
        events:               transformEvents(student?.upcomingEvents ?? []),
        isLoading,
        isError,
    }), [student, isLoading, isError]);

    return (
        <StudentDashboardContext.Provider value={value}>
            {children}
        </StudentDashboardContext.Provider>
    );
}

export function useStudentDashboard(): StudentDashboardContextType {
    const ctx = useContext(StudentDashboardContext);
    if (!ctx) throw new Error("useStudentDashboard must be used within a StudentDashboardProvider");
    return ctx;
}

// ─── Teacher Dashboard ──────────────────────────────────────────────────────

export interface TeacherDashboardContextType {
    coursesCount: number;
    numberOfStudents: number;
    department: string;
    courses: TeacherCourse[];
    announcements: DashboardAnnouncement[];
    events: DashboardEvent[];
    isLoading: boolean;
    isError: boolean;
}

const TeacherDashboardContext = createContext<TeacherDashboardContextType | undefined>(undefined);

export function TeacherDashboardProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getUserDashboardData(getToken() ?? ""),
        enabled:  !!getToken(),
    });

    const teacher = user?.role === "teacher" ? (user as Teacher) : undefined;

    const normalizedCourses: TeacherCourse[] = useMemo(() => {
        if (!teacher?.courses) return [];
        return Array.isArray(teacher.courses)
            ? teacher.courses
            : Array.from(teacher.courses as Iterable<TeacherCourse>);
    }, [teacher]);

    const value = useMemo<TeacherDashboardContextType>(() => ({
        coursesCount:     teacher?.coursesCount     ?? 0,
        numberOfStudents: teacher?.numberOfStudents  ?? 0,
        department:       teacher?.department        ?? "—",
        courses:          normalizedCourses,
        announcements:    transformAnnouncements(teacher?.announcements ?? []),
        events:           transformEvents(teacher?.upcomingEvents ?? []),
        isLoading,
        isError,
    }), [teacher, normalizedCourses, isLoading, isError]);

    return (
        <TeacherDashboardContext.Provider value={value}>
            {children}
        </TeacherDashboardContext.Provider>
    );
}

export function useTeacherDashboard(): TeacherDashboardContextType {
    const ctx = useContext(TeacherDashboardContext);
    if (!ctx) throw new Error("useTeacherDashboard must be used within a TeacherDashboardProvider");
    return ctx;
}
