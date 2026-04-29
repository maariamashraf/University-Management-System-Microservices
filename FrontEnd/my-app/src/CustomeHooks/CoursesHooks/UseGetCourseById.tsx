import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "../../Services/CourseService";
import type { course } from "../../Interfaces/course";
export const useGetCourseById = (id: string) => {
   const { data, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(Number(id)),
   });
   return { course: data, isLoading, error };
};