import type { EnrolledCoursesProps } from "../../Interfaces/dashboard";
import { getEnrollmentStatusColor } from "../../utils/courseUtils";

export default function EnrolledCourses({ courses, semester = "Spring 2026" }: EnrolledCoursesProps) {

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Currently Enrolled Courses</h2>
                <span className="text-sm text-blue-500 border border-blue-200 rounded-full px-4 py-1 font-medium">
                    {semester}
                </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 py-16 px-4">
                <table className="w-full text-sm h-full">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Course Code
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Course Name
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Instructor
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">
                                Credits
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                Status
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                                    No enrolled courses found.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-blue-50/40 transition-colors duration-150"
                                >
                                    <td className="py-3.5 px-4 font-mono text-sm text-blue-600 font-semibold whitespace-nowrap">
                                        {course.courseCode}
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-800 font-medium">
                                        {course.courseName}
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-600">
                                        {course.instructor}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                                            {course.credits}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEnrollmentStatusColor(course.status)}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                            View Materials
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
