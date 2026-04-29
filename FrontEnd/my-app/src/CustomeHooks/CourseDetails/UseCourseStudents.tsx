import { useQuery } from "@tanstack/react-query";
import { getAllStudentsByCourseId } from "../../Services/CourseService";
import type { EnrolledCourseResponse } from "../../Interfaces/enrolledCourse";

export function useCourseStudents(courseId: number) {
    const { data, isLoading, error } = useQuery<EnrolledCourseResponse[]>({
        queryKey: ["courseStudents", courseId],
        queryFn: () => getAllStudentsByCourseId(courseId),
        enabled: courseId > 0,
    });

    return {
        students: data ?? [],
        isLoading,
        error,
    };
}
