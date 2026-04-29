import { useQuery } from "@tanstack/react-query";
import { getRecentFeedbacks } from "../../Services/feedBacks";
import type { FeedBack } from "../../Interfaces/feedBack";

export default function useGetRecentFeedBacks() {
    const { data, isLoading, error } = useQuery<FeedBack[], Error>({
        queryKey: ["recent-feedbacks"],
        queryFn: getRecentFeedbacks,
    });

    return { data: data || [], isLoading, error: error as Error };
}