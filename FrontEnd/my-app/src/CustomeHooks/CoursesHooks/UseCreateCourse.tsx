import { useMutation } from "@tanstack/react-query";
import { createCourse } from "../../Services/CourseService";
import type { CourseRequest } from "../../Interfaces/course";
import { getUserId } from "../../Services/authService";
import { queryClient } from "../../main";

export function useCreateCourse() {
    const userId = getUserId();
    const { mutate, isPending, error } = useMutation({
        mutationFn: (course: CourseRequest) => createCourse(course),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacherCourses", userId] });
        },
    });
    if(error){
        console.error("Error creating course:", error instanceof Error ? error.message : error);
    }
    return {
        createCourse: mutate,
        isPending,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}