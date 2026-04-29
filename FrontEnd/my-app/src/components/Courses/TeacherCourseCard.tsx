import { useState } from "react";
import { motion } from "framer-motion";
import type { course } from "../../Interfaces/course";
import { isCompleted, getCourseColor, formatCourseDate, CourseIcon } from "../../utils/courseUtils";
import { useDeleteCourse } from "../../CustomeHooks/CoursesHooks/UseDeleteCourse";
import { StudentsModal } from "./StudentsModal";
import { useNavigate } from "react-router-dom";

interface Props {
    course: course;
    index?: number;
    onEdit: (course: course) => void;
}

export function TeacherCourseCard({ course, index = 0, onEdit }: Props) {
    const navigate = useNavigate();
    const completed = isCompleted(String(course.endDate));
    const p         = getCourseColor(course.courseCode);
    const { deleteCourse, isPending: isDeleting } = useDeleteCourse();
    const [studentsOpen, setStudentsOpen] = useState(false);

    const startLabel = formatCourseDate(String(course.startDate));
    const endLabel   = formatCourseDate(String(course.endDate));

    const enrolledPct = course.maxStudents > 0
        ? Math.round((course.enrolledStudents / course.maxStudents) * 100)
        : 0;
    const isFull = course.enrolledStudents >= course.maxStudents;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
        >
            {/* ── header ── */}
            <div className={`${p.header} px-5 pt-5 pb-5 relative overflow-hidden`}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-black/10" />

                <div className="relative flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <span className={`text-xs font-bold tracking-widest uppercase ${p.headerText}`}>
                            {course.courseCode}
                        </span>
                        <span className="text-white text-xl font-bold leading-none mt-0.5">
                            {course.credits}
                            <span className="text-sm font-medium text-white/70 ml-1">
                                {course.credits === 1 ? "Credit" : "Credits"}
                            </span>
                        </span>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                        <CourseIcon courseCode={course.courseCode} />
                    </div>
                </div>

                <h3 className="relative mt-3 text-white font-semibold text-base leading-snug line-clamp-2">
                    {course.name}
                </h3>

                {/* status badge */}
                <span className={`absolute top-4 right-4 mt-14 mr-0 text-xs font-semibold px-2 py-0.5 rounded-full
                    ${completed ? "bg-white/20 text-white/80" : "bg-white/30 text-white"}`}>
                    {completed ? "Ended" : "Active"}
                </span>
            </div>

            {/* ── body ── */}
            <div className="px-5 pt-4 pb-3 flex flex-col gap-3 flex-1">

                {/* department */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${p.pill}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3 h-3 ${p.pillText}`}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <span className="truncate">{course.department}</span>
                </div>

                {/* date chips */}
                <div className="flex flex-wrap gap-1.5">
                    {startLabel && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {startLabel}
                        </span>
                    )}
                    {endLabel && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {completed ? "Ended" : "Ends"} {endLabel}
                        </span>
                    )}
                </div>

                {/* enrollment capacity */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${p.pillText}`}>
                            {course.enrolledStudents} / {course.maxStudents} students
                        </span>
                        <span className={`font-medium ${isFull ? "text-rose-500" : "text-gray-400"}`}>
                            {isFull ? "Full" : `${course.maxStudents - course.enrolledStudents} seats left`}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${isFull ? "bg-rose-400" : p.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${enrolledPct}%` }}
                            transition={{ duration: 0.7, delay: index * 0.06 + 0.25, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* ── footer actions ── */}
            <div className="px-5 pb-5 flex flex-col gap-2">
                {/* students button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStudentsOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    View Students ({course.enrolledStudents})
                </motion.button>
                {/* CourseDetails button that will direct to the course details page that have all course data and material and announcements */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/CourseDetails/${course.id}`)}
                    className={`w-full py-2.5 rounded-xl bg-indigo-400 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5`}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    CourseDetails
                </motion.button>
                {/* edit + delete row */}
                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onEdit(course)}
                        className={`flex-1 py-2.5 rounded-xl ${p.btn} ${p.btnHover} text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5`}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => deleteCourse(course.id)}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        )}
                        Delete
                    </motion.button>
                </div>
            </div>

            <StudentsModal
                isOpen={studentsOpen}
                onClose={() => setStudentsOpen(false)}
                courseId={course.id}
                courseName={course.name}
            />
        </motion.div>
    );
}
