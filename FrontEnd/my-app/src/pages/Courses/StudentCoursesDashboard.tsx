import { useState } from "react";
import { useGetAllEnrolledCourses } from "../../CustomeHooks/CoursesHooks/UseGetAllEnrolledCourses";
import ErrorPage from "../../components/common/ErrorPage";
import LoadingSpinner from "../../components/common/LodingSpinner";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";
import { EnrolledCourseCard } from "../../components/Courses/EnrolledCourseCard";
import { isCompleted } from "../../utils/courseUtils";
import { getSemesterLabel } from "../../utils/dateUtils";

export function StudentCoursesDashboard() {
    const { enrolledCourses, isLoading, error } = useGetAllEnrolledCourses();
    const [activeTab, setActiveTab] = useState<"inProgress" | "completed">("inProgress");

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorPage />;

    const inProgress = enrolledCourses.filter((c: EnrolledCourseResponse) => !isCompleted(c.endDate));
    const completed  = enrolledCourses.filter((c: EnrolledCourseResponse) =>  isCompleted(c.endDate));
    const displayed  = activeTab === "inProgress" ? inProgress : completed;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Track your progress and access course materials</p>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm select-none">
                    {getSemesterLabel()}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {/* tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab("inProgress")}
                    className={`pb-3 text-sm font-semibold transition-colors ${
                        activeTab === "inProgress"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    In Progress ({inProgress.length})
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`pb-3 text-sm font-semibold transition-colors ${
                        activeTab === "completed"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Completed ({completed.length})
                </button>
            </div>

            {/* grid */}
            {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mb-4 opacity-40">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <p className="text-base font-medium">No {activeTab === "inProgress" ? "active" : "completed"} courses</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayed.map((course: EnrolledCourseResponse, i: number) => (
                        <EnrolledCourseCard key={course.id} course={course} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
