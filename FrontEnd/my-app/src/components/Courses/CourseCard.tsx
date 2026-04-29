import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isCourseFull } from "../../Services/CourseService";
import { DEPT_THEME, DEFAULT_THEME, DEPT_ICON, deptLabel, getCapacityPercent } from "../../Services/courseCardHelpers";
import type { course } from "../../Interfaces/course";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";


export interface CourseCardProps {
    course: course;
    enrollment: EnrolledCourseResponse | undefined;
    onEnroll: () => void;
    onDrop: (enrolledCourseId: number) => void;
    isEnrolling: boolean;
    isDropping: boolean;
}

export default function CourseCard({ course, enrollment, onEnroll, onDrop, isEnrolling, isDropping }: CourseCardProps) {
    const navigate = useNavigate();
    const full     = isCourseFull(course.enrolledStudents, course.maxStudents);
    const enrolled = enrollment !== undefined;
    const fillPct  = getCapacityPercent(course.enrolledStudents, course.maxStudents);
    const theme    = DEPT_THEME[course.department] ?? DEFAULT_THEME;
    const icon     = DEPT_ICON[course.department] ?? "📚";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.18 } }}
            className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
        >
            {/* ── ENROLLED ribbon ── */}
            {enrolled && (
                <div className="absolute top-5 -right-7 rotate-45 bg-green-500 text-white text-[9px] font-extrabold tracking-widest px-9 py-[3px] z-10 shadow">
                    ENROLLED
                </div>
            )}

            {/* ── Coloured department header ── */}
            <div className={`bg-gradient-to-br ${theme.header} px-5 pt-5 pb-4 relative overflow-hidden`}>
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />

                <div className="relative flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                            {deptLabel(course.department)}
                        </span>
                        <span className="text-white font-bold text-lg leading-none">
                            {course.courseCode}
                        </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                        {icon}
                    </div>
                </div>

                <h3 className="relative mt-3 text-white font-semibold text-sm leading-snug line-clamp-2 pr-2">
                    {course.name}
                </h3>
            </div>

            {/* ── Body ── */}
            <div className="px-5 pt-4 pb-3 flex flex-col gap-3 flex-1">
                {/* Credits + teacher row */}
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge} ${theme.badgeText}`}>
                        {course.credits} {course.credits === 1 ? "Credit" : "Credits"}
                    </span>
                    {course.teacherName && (
                        <div className="flex items-center gap-1.5 min-w-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                                className={`w-3.5 h-3.5 flex-shrink-0 ${theme.badgeText}`}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span className="text-xs text-gray-500 truncate">{course.teacherName}</span>
                        </div>
                    )}
                </div>

                {/* Capacity bar */}
                <div className="flex flex-col gap-1.5 mt-auto">
                    <div className="flex justify-between items-center text-xs">
                        {full ? (
                            <span className="font-semibold text-red-500">Course Full</span>
                        ) : (
                            <span className="text-gray-400">Capacity</span>
                        )}
                        <span className={`font-semibold tabular-nums ${full ? "text-red-500" : "text-gray-700"}`}>
                            {course.enrolledStudents} / {course.maxStudents}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${full ? "bg-red-400" : theme.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Action button ── */}
            <div className="px-5 pb-5 flex flex-col gap-2">
                {enrolled && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/CourseDetails/${course.id}`)}
                        className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${theme.header} text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer`}
                    >
                        Go to Course →
                    </motion.button>
                )}
                {enrolled ? (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onDrop(enrollment.id)}
                        disabled={isDropping}
                        className="w-full py-2.5 rounded-xl border-2 border-red-400 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                        {isDropping ? "Dropping…" : "Drop Course"}
                    </motion.button>
                ) : full ? (
                    <button disabled className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed">
                        Closed
                    </button>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onEnroll}
                        disabled={isEnrolling}
                        className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${theme.header} text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60`}
                    >
                        {isEnrolling ? "Registering…" : "Register Now"}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
