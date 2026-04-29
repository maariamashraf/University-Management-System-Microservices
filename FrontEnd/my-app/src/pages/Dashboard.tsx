import { CheckCircle, Clock, BookOpen, Star } from "lucide-react";
import { Navigate } from "react-router-dom";
import StatsCard from "../components/Dashboard/StatsCard";
import EnrolledCourses from "../components/Dashboard/EnrolledCourses";
import RecentAnnouncements from "../components/Dashboard/RecentAnnouncements";
import UpcomingEvents from "../components/Dashboard/UpcomingEvents";
import TeacherDashboard from "./TeacherDashboard";
import { StudentDashboardProvider, useStudentDashboard } from "../ContextsProviders/DashboardContext";
import { getRole } from "../Services/userService";

function StudentDashboardContent() {
    const { gpa, totalCredits, enrolledCoursesCount, academicStanding, courses,  events } = useStudentDashboard();

    return (
        <main className="flex flex-col bg-gray-100 min-h-full py-8 px-8 gap-6">
            <div className="grid grid-cols-4 gap-5">
                <StatsCard
                    title="Current GPA"
                    value={gpa}
                    subtitle="Out of 4.00"
                    icon={CheckCircle}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-500"
                    valueColor="text-blue-600"
                />
                <StatsCard
                    title="Total Credits"
                    value={totalCredits}
                    subtitle={`${totalCredits} / ${totalCredits} Completed`}
                    icon={Clock}
                    iconBgColor="bg-cyan-100"
                    iconColor="text-cyan-500"
                    valueColor="text-cyan-600"
                />
                <StatsCard
                    title="Enrolled Courses"
                    value={enrolledCoursesCount}
                    subtitle="Current Semester"
                    icon={BookOpen}
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-500"
                    valueColor="text-purple-600"
                />
                <StatsCard
                    title="Academic Standing"
                    value={academicStanding}
                    subtitle="Keep it up!"
                    icon={Star}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-500"
                    valueColor="text-yellow-500"
                />
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
                    <EnrolledCourses courses={courses} semester="Spring 2026" />
                </div>
                <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
                    <RecentAnnouncements  />
                </div>
            </div>

            <UpcomingEvents events={events} />
        </main>
    );
}

export default function Dashboard() {
    const role = getRole();
    if (role === "admin") {
        return <Navigate to="/dashboard/admin/users-permissions" replace />;
    }

    if (role === "teacher") {
        return <TeacherDashboard />;
    }

    return (
        <StudentDashboardProvider>
            <StudentDashboardContent />
        </StudentDashboardProvider>
    );
}
