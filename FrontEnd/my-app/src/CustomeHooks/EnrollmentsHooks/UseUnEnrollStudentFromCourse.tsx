import { useMutation } from "@tanstack/react-query";
import { unenrollStudentFromCourse } from "../../Services/EnrolledCourseService";
import { queryClient } from "../../main";
import { toast } from "sonner";

export function useUnEnrollStudentFromCourse() {
    const { mutate, isPending, error } = useMutation({
        mutationFn: (enrolledCourseId: number) => unenrollStudentFromCourse(enrolledCourseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
        },
        onError: (err) => {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error("Error unenrolling student from course:", errorMsg);
            toast.error(errorMsg);
        },
    });

    return {
        drop: mutate,
        isDropping: isPending,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    };
}
