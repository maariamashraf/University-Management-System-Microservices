import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Award } from "lucide-react";
import { getBackgroundColor, getCourseEnrollButtonStyle, isCourseFull, getDepartmentIcon } from "../../Services/CourseService";
import type { course } from "../../Interfaces/course";

interface CourseCardProps {
    course: course;
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.4)",
            }}
            transition={{ duration: 0.01 }}
            className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
            <div className={`relative w-full h-48 flex items-center justify-center ${getBackgroundColor(course.department)}`}>
                <motion.div className="text-7xl">
                    {getDepartmentIcon(course.department)}
                </motion.div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">{course.department}</span>
                </div>
            </div>

            <div className="flex flex-col p-6 flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2">{course.name}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{course.description}</p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                        <GraduationCap className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{course.teacherName}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{course.enrolledStudents} / {course.maxStudents} Students</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <Award className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{course.credits} Credits</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <BookOpen className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">
                            {Math.round((course.enrolledStudents / course.maxStudents) * 100)}% Enrolled
                        </span>
                    </div>
                </div>

                <motion.button
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full ${getCourseEnrollButtonStyle(course.enrolledStudents, course.maxStudents)} text-white px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                >
                    {isCourseFull(course.enrolledStudents, course.maxStudents) ? "Course Full" : "Enroll Now"}
                </motion.button>
            </div>
        </motion.div>
    );
}
