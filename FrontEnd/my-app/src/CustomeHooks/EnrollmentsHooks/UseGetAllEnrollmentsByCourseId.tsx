import { useQuery } from "@tanstack/react-query";
import { getAllStudentsByCourseId } from "../../Services/CourseService";

export function useGetAllStudentsByCourseId(courseId: number) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["allStudentsByCourseId", courseId],
        queryFn: () => getAllStudentsByCourseId(courseId),
    });
    if(error){
        console.error("Error fetching all students by course id:", error instanceof Error ? error.message : error);
    }
    return {
        allStudentsByCourseId: data || [],
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}
    