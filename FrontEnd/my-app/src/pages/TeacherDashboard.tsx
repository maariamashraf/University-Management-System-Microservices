import { BookOpen, Users, Building2, Award } from "lucide-react";
import StatsCard from "../components/Dashboard/StatsCard";
import TeachingCourses from "../components/Dashboard/TeachingCourses";
import RecentAnnouncements from "../components/Dashboard/RecentAnnouncements";
import UpcomingEvents from "../components/Dashboard/UpcomingEvents";
import { TeacherDashboardProvider, useTeacherDashboard } from "../ContextsProviders/DashboardContext";

function TeacherDashboardContent() {
    const { coursesCount, numberOfStudents, department, courses, announcements, events } = useTeacherDashboard();

    return (
        <main className="flex flex-col bg-gray-100 min-h-full py-8 px-8 gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-5">
                <StatsCard
                    title="Courses Teaching"
                    value={coursesCount}
                    subtitle="Current Semester"
                    icon={BookOpen}
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-500"
                    valueColor="text-purple-600"
                />
                <StatsCard
                    title="Total Students"
                    value={numberOfStudents}
                    subtitle="Across all courses"
                    icon={Users}
                    iconBgColor="bg-cyan-100"
                    iconColor="text-cyan-500"
                    valueColor="text-cyan-600"
                />
                <StatsCard
                    title="Department"
                    value={department}
                    subtitle="Faculty member"
                    icon={Building2}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-500"
                    valueColor="text-blue-600"
                />
                <StatsCard
                    title="Faculty Status"
                    value="Active"
                    subtitle="Keep up the great work!"
                    icon={Award}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-500"
                    valueColor="text-yellow-500"
                />
            </div>

            {/* Middle Row: Teaching Courses + Announcements */}
            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
                    <TeachingCourses courses={courses} semester="Spring 2026" />
                </div>
                <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
                    <RecentAnnouncements announcements={announcements} />
                </div>
            </div>

            {/* Bottom Row: Upcoming Events */}
            <UpcomingEvents events={events} />
        </main>
    );
}

export default function TeacherDashboard() {
    return (
        <TeacherDashboardProvider>
            <TeacherDashboardContent />
        </TeacherDashboardProvider>
    );
}
