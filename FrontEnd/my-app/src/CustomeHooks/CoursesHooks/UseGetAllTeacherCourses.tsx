import { useQuery } from "@tanstack/react-query";
import { getAllCoursesByTeacherId } from "../../Services/CourseService";
import { getUserId } from "../../Services/authService";

export function useGetAllTeacherCourses() {
    const userId = getUserId();
    const { data, isLoading, error } = useQuery({
        queryKey: ["teacherCourses", userId],
        queryFn: () => getAllCoursesByTeacherId(userId!),
        enabled: !!userId,
    });
    if(error){
        console.error("Error fetching teacher courses:", error instanceof Error ? error.message : error);
    }
    return {
        teacherCourses: data || [],
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}