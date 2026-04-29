import { useState } from "react";
import { useGetAllCourses } from "../../CustomeHooks/CoursesHooks/UseGetAllCourses";
import { useGetAllEnrolledCourses } from "../../CustomeHooks/CoursesHooks/UseGetAllEnrolledCourses";
import { useEnrollCourse } from "../../CustomeHooks/EnrollmentsHooks/UseEnrollCourse";
import { useUnEnrollStudentFromCourse } from "../../CustomeHooks/EnrollmentsHooks/UseUnEnrollStudentFromCourse";
import CourseCard from "./CourseCard";
import LoadingSpinner from "../common/LodingSpinner";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";

interface AllCoursesProps {
    search?: string;
    department?: string;
}
//Todo: the courseCard Capacity do not change when the course is enrolled or dropped
export default function AllCourses({ search = "", department = "all" }: AllCoursesProps) {
    const { courses, isLoading, error } = useGetAllCourses();
    const { enrolledCourses } = useGetAllEnrolledCourses();

    const [enrollingId, setEnrollingId] = useState<number | null>(null);
    const [droppingId, setDroppingId]   = useState<number | null>(null);

    const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
    const { drop, isDropping } = useUnEnrollStudentFromCourse();

    const enrolledMap = new Map<number, EnrolledCourseResponse>(
        enrolledCourses.map((ec: EnrolledCourseResponse) => [ec.courseId, ec])
    );

    if (isLoading) return <LoadingSpinner />;

    if (error) return (
        <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-red-300">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-gray-500 font-medium">Could not load courses</p>
            <p className="text-sm text-gray-400">{error}</p>
        </div>
    );

    const filtered = courses.filter((c) => {
        const matchesSearch =
            search.trim() === "" ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
            c.teacherName?.toLowerCase().includes(search.toLowerCase());
        const matchesDept = department === "all" || c.department === department;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 && (
                <p className="col-span-3 text-center text-gray-400 py-12">No courses match your search.</p>
            )}
            {filtered.map((course) => {
                const enrollment = enrolledMap.get(course.id);
                return (
                    <CourseCard
                        key={course.id}
                        course={course}
                        enrollment={enrollment}
                        onEnroll={() => {
                            setEnrollingId(course.id);
                            enroll(course.id, { onSettled: () => setEnrollingId(null) });
                        }}
                        onDrop={(enrolledCourseId) => {
                            setDroppingId(enrolledCourseId);
                            drop(enrolledCourseId, { onSettled: () => setDroppingId(null) });
                        }}
                        isEnrolling={isEnrolling && enrollingId === course.id}
                        isDropping={isDropping && droppingId === enrollment?.id}
                    />
                );
            })}
        </div>
    );
}
