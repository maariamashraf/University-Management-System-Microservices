import { useQuery } from "@tanstack/react-query";
import { getEventsByUser } from "../../Services/UpcomingEventService";
import type { UpcomingEventResponse } from "../../Interfaces/upComingEvent";

export function useCourseEvents(userId: number) {
    const { data, isLoading, error } = useQuery<UpcomingEventResponse[]>({
        queryKey: ["userEvents", userId],
        queryFn: () => getEventsByUser(userId),
        enabled: userId > 0,
    });

    return {
        events: data ?? [],
        isLoading,
        error,
    };
}
