import { useQuery } from "@tanstack/react-query";
import { getUserId } from "../../Services/authService";
import { getTeacherDetails } from "../../Services/teacherService";
export const useGetTeacherSetting = () => {
    const userId = getUserId();
    const { data, isLoading, error } = useQuery({
        queryKey: ["teacher", userId],
        queryFn: () => getTeacherDetails(userId),
    });
    return { data, isLoading, error };
};