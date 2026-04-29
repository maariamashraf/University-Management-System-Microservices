import { useMutation } from "@tanstack/react-query";
import { updateCourse } from "../../Services/CourseService";
import type { CourseRequest } from "../../Interfaces/course";
import { getUserId } from "../../Services/authService";
import { queryClient } from "../../main";
export function useUpdateCourse() {
    const userId = getUserId();
    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ courseId, course }: { courseId: number, course: CourseRequest }) => updateCourse(courseId, course),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacherCourses", userId] });
        },
    });
    if(error){
        console.error("Error updating course:", error instanceof Error ? error.message : error);
    }
    return {
        updateCourse: mutate,
        isPending,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}