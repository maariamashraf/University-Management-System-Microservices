import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../../Services/CourseService";
import type { course } from "../../Interfaces/course";

export function useGetAllCourses() {
    const { data, isLoading, error } = useQuery<course[], Error>({
        queryKey: ["allCourses"],
        queryFn: getAllCourses,
    });
    console.log("data",data);
    return {
        courses: data || [],
        isLoading,
        error: error instanceof Error ? error.message : null,
    };
}