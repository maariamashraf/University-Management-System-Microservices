import { useMutation } from "@tanstack/react-query";
import type { EnrolledCourseRequest } from "../../Interfaces/enrolledCourse";
import {enrollStudentInCourse} from "../../Services/EnrolledCourseService";
import { queryClient } from "../../main";
import { getUserId } from "../../Services/authService";
import { toast } from "sonner";
export const useEnrollCourse = () => {
    const userId = getUserId();
    const { mutate, isPending, error } = useMutation({
        mutationFn: async (courseId: number) => {
            const enrolledCourseRequest : EnrolledCourseRequest = {
                studentId: userId,
                courseId: courseId
            };
            const response = await enrollStudentInCourse(enrolledCourseRequest);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Error enrolling student in course:", message);
            if (/access denied|missing required permission|permission|forbidden|denied/i.test(message)) {
                toast.error("You do not have permission to register this course.");
                return;
            }
            toast.error(message);
        },
    });
    return { mutate, isPending, error };
};