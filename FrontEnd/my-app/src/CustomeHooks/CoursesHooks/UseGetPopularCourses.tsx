import { useQuery } from "@tanstack/react-query";
import { getMostPopularCourses } from "../../Services/CourseService";
import LoadingSpinner from "../../components/common/LodingSpinner";

export const useGetPopularCourses = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["popular-courses"],
        queryFn: getMostPopularCourses,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }
    return { data,error };
}