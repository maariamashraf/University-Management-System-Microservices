import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../../Services/DepartmentService";
import LoadingSpinner from "../../components/common/LodingSpinner";
import type { department } from "../../Interfaces/department";

export const useGetDepartments = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return { data, error };
}