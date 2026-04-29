import { getEnrolledCoursesByStudentId } from "../../Services/EnrolledCourseService";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "../../Services/authService";

export function useGetAllEnrolledCourses() {
    const userId = getUserId();
    const { data, isLoading, error } = useQuery({
        queryKey: ["enrolledCourses", userId],
        queryFn: () => getEnrolledCoursesByStudentId(userId!),
        enabled: !!userId,
    });
    if(error){
    console.error("Error fetching enrolled courses:", error instanceof Error ? error.message : error);
    }
    return {
        enrolledCourses: data || [],
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}