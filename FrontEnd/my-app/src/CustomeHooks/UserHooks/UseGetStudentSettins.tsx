import { useQuery } from "@tanstack/react-query";
import { getStudentInfo } from "../../Services/studentService";
import { getUserId } from "../../Services/authService";
export const useGetStudentSettins = () => {
    const userId = getUserId();
    const { data, isLoading, error } = useQuery({
        queryKey: ["student", userId],
        queryFn: () => getStudentInfo(userId),
    });
    return { data, isLoading, error };
};