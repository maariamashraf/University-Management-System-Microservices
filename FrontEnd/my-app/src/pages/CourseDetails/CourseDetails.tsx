import { useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, ClipboardList, FolderOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useGetCourseById } from "../../CustomeHooks/CoursesHooks/UseGetCourseById";
import { getUserDashboardData, getRole } from "../../Services/userService";
import { getToken, getUserId, getUserName } from "../../Services/authService";
import LoadingSpinner from "../../components/common/LodingSpinner";
import ErrorPage from "../../components/common/ErrorPage";
import CourseHeader from "../../components/CourseDetails/CourseHeader";
import CourseSidebar from "../../components/CourseDetails/CourseSidebar";
import CourseOverview from "../../components/CourseDetails/CourseOverview";
import CourseStudentsTab from "../../components/CourseDetails/CourseStudentsTab";
import CourseChatTab from "../../components/CourseDetails/CourseChatTab";
import CoursePlaceholderTab from "../../components/CourseDetails/CoursePlaceholderTab";
import type { CourseTab } from "../../Interfaces/courseDetails";
import type { course } from "../../Interfaces/course";
import type { Student } from "../../Interfaces/student";
import type { Teacher } from "../../Interfaces/teacher";

export default function CourseDetails() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<CourseTab>("overview");

    const { course, isLoading, error } = useGetCourseById(id ?? "");

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserDashboardData(getToken() ?? ""),
        enabled: !!getToken(),
    });

    if (isLoading) return <LoadingSpinner />;
    if (error || !course) return <ErrorPage />;

    const role = getRole();
    const userId = getUserId();
    const displayName =
        role === "teacher"
            ? (user as Teacher)?.name ?? getUserName()
            : (user as Student)?.username ?? getUserName();

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <CourseHeader course={course} displayName={displayName} role={role} />

            <div className="flex flex-1 overflow-hidden">
                <CourseSidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    course={course}
                    enrolledCount={course.enrolledStudents}
                />

                <main className="flex-1 overflow-y-auto p-6">
                    <TabContent
                        activeTab={activeTab}
                        course={course}
                        displayName={displayName}
                        userId={userId}
                    />
                </main>
            </div>
        </div>
    );
}

interface TabContentProps {
    activeTab: CourseTab;
    course: course;
    displayName: string;
    userId: number;
}

function TabContent({ activeTab, course, displayName, userId }: TabContentProps) {
    const role = getRole();
    switch (activeTab) {
        case "overview":
            return (
                <CourseOverview
                    course={course}
                    displayName={displayName}
                    userId={userId}
                    canCreateAnnouncements={role === "teacher" || role === "admin"}
                />
            );

        case "chat":
            return (
                <CourseChatTab
                    courseId={course.id}
                    currentUserId={userId}
                    currentUserName={displayName}
                />
            );

        case "students":
            return <CourseStudentsTab courseId={course.id} />;

        case "lectures":
            return (
                <CoursePlaceholderTab
                    icon={BookOpen}
                    title="Lectures"
                    description="Lecture materials and recordings will appear here once uploaded by your instructor."
                />
            );

        case "assignments":
            return (
                <CoursePlaceholderTab
                    icon={ClipboardList}
                    title="Assignments"
                    description="Assignments and submission deadlines will be listed here."
                />
            );

        case "resources":
            return (
                <CoursePlaceholderTab
                    icon={FolderOpen}
                    title="Resources"
                    description="Course materials, slides, and reference documents will be available here."
                />
            );

        case "grades":
            return (
                <CoursePlaceholderTab
                    icon={GraduationCap}
                    title="Grades"
                    description="Your grades and performance reports for this course will appear here."
                />
            );

        default:
            return null;
    }
}
