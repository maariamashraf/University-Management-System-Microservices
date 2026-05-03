import { useMemo, useState } from "react";
import { useGetAllCourses } from "../../../../CustomeHooks/CoursesHooks/UseGetAllCourses";
import type { course } from "../../../../Interfaces/course";

export function AdminCoursesDashboard() {
   const {courses,isLoading,error} = useGetAllCourses();
   console.log("courses",courses);
   const [search,setSearch] = useState("");
   const [department,setDepartment] = useState("all");
   
   const curCoursesFilterd = useMemo<course[]>(() => {
       const searchValue = search.trim().toLowerCase();

       return courses.filter((item) => {
           const matchDepartment = department === "all" || item.department === department;
           const matchSearch =
               searchValue.length === 0 ||
               item.name.toLowerCase().includes(searchValue) ||
               item.courseCode.toLowerCase().includes(searchValue) ||
               item.teacherName.toLowerCase().includes(searchValue);

           return matchDepartment && matchSearch;
       });
   }, [courses, department, search]);
    
    return (
        <div className="min-h-full bg-slate-100 p-8 flex flex-col gap-6">
            <div className="mr-auto max-w-7xl space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Course Administration Management</h1>
                <p className="text-md font-medium text-slate-600">Manage courses and their administration</p>
            </div>

            <div className="flex  justify-between">
                <input type="text" id="search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses.. 🔍" className=" rounded-lg bg-white border border-slate-200 p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <select id="department" name="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-lg border border-slate-200 p-2 border-black bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All</option>
                    <option value="Computer_Science">Computer Science</option>
                    <option value="Information_Systems">Information Systems</option>
                    <option value="Software_Engineering">Software Engineering</option>
                    <option value="Artificial_Intelligence">Artificial Intelligence</option>
                    <option value="Data_Science">Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Information_Technology">Information Technology</option>
                </select>

            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Course Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Department
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Instructor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Enrollment Count
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Course Code
                            </th>
                            <th className="pr-8 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                                    Loading courses...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : curCoursesFilterd.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                                    No courses found.
                                </td>
                            </tr>
                        ) : (
                            curCoursesFilterd.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{course.name}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{course.department}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{course.teacherName}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{course.enrolledStudents}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{course.courseCode}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="rounded-md bg-red-400 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600">
                                            Delete
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