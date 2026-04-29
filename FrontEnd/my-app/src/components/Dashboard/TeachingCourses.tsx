import type { TeachingCoursesProps } from "../../Interfaces/dashboard";
import { getCapacityColor } from "../../utils/courseUtils";

export default function TeachingCourses({ courses, semester = "Spring 2026" }: TeachingCoursesProps) {

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Teaching Courses</h2>
                <span className="text-md text-blue-500 border border-blue-200 rounded-full px-4 py-1">{semester}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="pb-3 text-md font-semibold text-gray-500 uppercase tracking-wider">COURSE NAME</th>
                            <th className="pb-3 text-md font-semibold text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                            <th className="pb-3 text-md font-semibold text-gray-500 uppercase tracking-wider text-center">CREDITS</th>
                            <th className="pb-3 text-md font-semibold text-gray-500 uppercase tracking-wider text-center">ENROLLMENT</th>
                            <th className="pb-3 text-md font-semibold text-gray-500 uppercase tracking-wider">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                                    No courses assigned yet.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course, index) => (
                                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-4 text-sm text-gray-700 font-medium">{course.name}</td>
                                    <td className="py-4 text-sm text-gray-700">{course.departmentName}</td>
                                    <td className="py-4 text-sm text-gray-700 text-center">{course.creditHours}</td>
                                    <td className="py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCapacityColor(course.enrolledStudents, course.maxStudents)}`}>
                                            {course.enrolledStudents} / {course.maxStudents}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-blue-500 text-sm font-medium hover:underline">
                                            Manage Course
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
