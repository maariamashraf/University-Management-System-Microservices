import { useState } from "react";
import { motion } from "framer-motion";
import { useGetAllTeacherCourses } from "../../CustomeHooks/CoursesHooks/UseGetAllTeacherCourses";
import { useCreateCourse } from "../../CustomeHooks/CoursesHooks/UseCreateCourse";
import { useUpdateCourse } from "../../CustomeHooks/CoursesHooks/UseUpdateCourse";
import { TeacherCourseCard } from "../../components/Courses/TeacherCourseCard";
import { CourseFormModal } from "../../components/Courses/CourseFormModal";
import ErrorPage from "../../components/common/ErrorPage";
import LoadingSpinner from "../../components/common/LodingSpinner";
import { isCompleted } from "../../utils/courseUtils";
import { getUserName } from "../../Services/authService";
import type { course, CourseRequest } from "../../Interfaces/course";
import { getSemesterLabel } from "../../utils/dateUtils";
export function TeacherCoursesDashboard() {
    const { teacherCourses, isLoading, error } = useGetAllTeacherCourses();
    const { createCourse, isPending: isCreating } = useCreateCourse();
    const { updateCourse, isPending: isUpdating } = useUpdateCourse();

    const [activeTab, setActiveTab]     = useState<"active" | "completed">("active");
    const [modalOpen, setModalOpen]     = useState(false);
    const [editCourse, setEditCourse]   = useState<course | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const teacherUserName = getUserName();

    if (isLoading) return <LoadingSpinner />;
    if (error)     return <ErrorPage />;

    const active    = teacherCourses.filter((c: course) => !isCompleted(String(c.endDate)));
    const completed = teacherCourses.filter((c: course) =>  isCompleted(String(c.endDate)));
    const displayed = activeTab === "active" ? active : completed;

    function openCreate() {
        setEditCourse(null);
        setSubmitError(null);
        setModalOpen(true);
    }

    function openEdit(course: course) {
        setEditCourse(course);
        setSubmitError(null);
        setModalOpen(true);
    }

    function getReadableError(error: unknown) {
        const defaultMsg = "Unable to complete this operation. Please try again.";
        if (!(error instanceof Error) || !error.message) return defaultMsg;

        const message = error.message.toLowerCase();
        if (message.includes("forbidden") || message.includes("access denied") || message.includes("permission")) {
            return "You do not have permission to perform this operation.";
        }
        return error.message;
    }

    function handleSubmit(data: CourseRequest) {
        setSubmitError(null);
        if (editCourse) {
            updateCourse(
                { courseId: editCourse.id, course: data },
                {
                    onSuccess: () => {
                        setSubmitError(null);
                        setModalOpen(false);
                    },
                    onError: (error) => {
                        setSubmitError(getReadableError(error));
                    },
                }
            );
        } else {
            console.log({ ...data, teacherUserName });
            createCourse(data, {
                onSuccess: () => {
                    setSubmitError(null);
                    setModalOpen(false);
                },
                onError: (error) => {
                    setSubmitError(getReadableError(error));
                },
            });
        }
    }

    return (
        <>
            <div className="p-6 max-w-7xl mx-auto">
                {/* ── header ── */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and monitor your teaching courses</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* semester badge */}
                        <div className="hidden sm:flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm select-none">
                            {getSemesterLabel()}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>

                        {/* create button */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Course
                        </motion.button>
                    </div>
                </div>

                {/* ── stats row ── */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Total Courses",    value: teacherCourses.length, color: "text-indigo-600", bg: "bg-indigo-100" },
                        { label: "Active Courses",   value: active.length,         color: "text-emerald-600", bg: "bg-emerald-100" },
                        { label: "Completed Courses",value: completed.length,      color: "text-gray-500",   bg: "bg-gray-200"    },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl px-4 py-3 flex flex-col gap-0.5`}>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                            <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── tabs ── */}
                <div className="flex gap-6 border-b border-gray-200 mb-6">
                    {(["active", "completed"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-semibold capitalize transition-colors ${
                                activeTab === tab
                                    ? "text-indigo-600 border-b-2 border-indigo-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab === "active" ? `Active (${active.length})` : `Completed (${completed.length})`}
                        </button>
                    ))}
                </div>

                {/* ── grid ── */}
                {displayed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mb-4 opacity-40">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <p className="text-base font-medium">No {activeTab} courses</p>
                        {activeTab === "active" && (
                            <button onClick={openCreate} className="mt-3 text-sm text-indigo-500 hover:text-indigo-600 font-medium">
                                + Create your first course
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {displayed.map((course: course, i: number) => (
                            <TeacherCourseCard
                                key={course.id}
                                course={course}
                                index={i}
                                onEdit={openEdit}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── modal ── */}
            <CourseFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setSubmitError(null);
                    setModalOpen(false);
                }}
                onSubmit={handleSubmit}
                isPending={isCreating || isUpdating}
                editCourse={editCourse}
                teacherUserName={teacherUserName}
                submitError={submitError}
            />
        </>
    );
}
