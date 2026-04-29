import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useGetAllStudentsByCourseId } from "../../CustomeHooks/EnrollmentsHooks/UseGetAllEnrollmentsByCourseId";
import { useUnEnrollStudentFromCourse } from "../../CustomeHooks/EnrollmentsHooks/UseUnEnrollStudentFromCourse";
import { queryClient } from "../../main";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    courseId: number;
    courseName: string;
}

function StudentRow({ enrollment, courseId }: { enrollment: EnrolledCourseResponse; courseId: number }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { drop: unenrollStudentFromCourse, isDropping: isPending } = useUnEnrollStudentFromCourse();

    function handleUnenroll() {
        unenrollStudentFromCourse(enrollment.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["allStudentsByCourseId", courseId] });
                queryClient.invalidateQueries({ queryKey: ["teacherCourses"] });
                setConfirmOpen(false);
            },
        });
    }

    const enrollDate = enrollment.enrollmentDate
        ? new Date(enrollment.enrollmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
            {/* avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {enrollment.studentName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{enrollment.studentName}</p>
                {enrollDate && (
                    <p className="text-xs text-gray-400">Enrolled {enrollDate}</p>
                )}
            </div>

            {/* action */}
            {confirmOpen ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-gray-500 mr-1">Sure?</span>
                    <button
                        onClick={handleUnenroll}
                        disabled={isPending}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                        {isPending ? (
                            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : "Yes"}
                    </button>
                    <button
                        onClick={() => setConfirmOpen(false)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        No
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setConfirmOpen(true)}
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center gap-1"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="17" y1="8" x2="23" y2="14" />
                        <line x1="23" y1="8" x2="17" y2="14" />
                    </svg>
                    Unenroll
                </button>
            )}
        </motion.div>
    );
}

export function StudentsModal({ isOpen, onClose, courseId, courseName }: Props) {
    const { allStudentsByCourseId, isLoading } = useGetAllStudentsByCourseId(courseId);
    const [search, setSearch] = useState("");

    const filtered: EnrolledCourseResponse[] = allStudentsByCourseId.filter((s: EnrolledCourseResponse) =>
        s.studentName?.toLowerCase().includes(search.toLowerCase())
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* panel */}
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden max-h-[85vh]">

                            {/* header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-base font-bold text-gray-800">Enrolled Students</h2>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">{courseName}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* search */}
                            <div className="px-5 py-3 border-b border-gray-100">
                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search students..."
                                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* count badge */}
                            <div className="px-5 pt-3 pb-1 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-medium">
                                    {filtered.length} {filtered.length === 1 ? "student" : "students"}
                                    {search && ` matching "${search}"`}
                                </span>
                            </div>

                            {/* list */}
                            <div className="overflow-y-auto flex-1 px-2 pb-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <svg className="w-6 h-6 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 mb-2 opacity-40">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        <p className="text-sm font-medium">
                                            {search ? "No students match your search" : "No students enrolled yet"}
                                        </p>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {filtered.map((enrollment: EnrolledCourseResponse) => (
                                            <StudentRow
                                                key={enrollment.id}
                                                enrollment={enrollment}
                                                courseId={courseId}
                                            />
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
