import { useMutation } from "@tanstack/react-query";
import { deleteCourse } from "../../Services/CourseService";
import { getUserId } from "../../Services/authService";
import { queryClient } from "../../main";
import { toast } from "sonner";

export function useDeleteCourse() {
    const userId = getUserId();
    const { mutate, isPending, error } = useMutation({
        mutationFn: (courseId: number) => deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacherCourses", userId] });
        },
        onError: (err) => {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error("Error deleting course:", errorMsg);
            toast.error(errorMsg);
        },
    });

    return {
        deleteCourse: mutate,
        isPending,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}