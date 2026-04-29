import { motion } from "framer-motion";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";
import {
    isCompleted,
    getCourseColor,
    formatCourseDate,
    CourseIcon,
} from "../../utils/courseUtils";
import { useNavigate } from "react-router-dom";

export function EnrolledCourseCard({ course, index = 0 }: { course: EnrolledCourseResponse; index?: number }) {
    const navigate   = useNavigate();
    const completed  = isCompleted(course.endDate);
    const p          = getCourseColor(course.courseCode);
    const endLabel   = formatCourseDate(course.endDate);
    const enrollLabel = formatCourseDate(course.enrollmentDate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
        >
            {/* ── header band ── */}
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
                    {course.courseName}
                </h3>
            </div>

            {/* ── body ── */}
            <div className="px-5 pt-4 pb-3 flex flex-col gap-3 flex-1">

                {/* teacher */}
                {course.teacherName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${p.pill}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3 h-3 ${p.pillText}`}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <span className="truncate">{course.teacherName}</span>
                    </div>
                )}

                {/* date chips */}
                <div className="flex flex-wrap gap-1.5">
                    {enrollLabel && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {enrollLabel}
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

                {/* status */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    {completed ? (
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-emerald-500 flex-shrink-0">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span className="text-xs font-semibold text-emerald-600">Completed</span>
                            <div className={`ml-auto h-1.5 w-20 rounded-full ${p.bar} opacity-60`} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold ${p.pillText}`}>In Progress</span>
                                <span className="text-xs text-gray-400">Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${p.bar} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "40%" }}
                                    transition={{ duration: 0.7, delay: index * 0.06 + 0.25, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── footer button ── */}
            <div className="px-5 pb-5">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/CourseDetails/${course.courseId}`)}
                    className={`w-full py-2.5 rounded-xl ${p.btn} ${p.btnHover} text-white text-sm font-semibold transition-colors cursor-pointer`}
                >
                    Go to Course →
                </motion.button>
            </div>
        </motion.div>
    );
}
