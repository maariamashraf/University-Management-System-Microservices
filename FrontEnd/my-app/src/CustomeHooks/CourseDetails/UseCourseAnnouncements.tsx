import { useQuery } from "@tanstack/react-query";
import { getAnnouncementByCourseId } from "../../Services/AnnouncmentService";
import type { AnnouncementCourseResponse } from "../../Interfaces/announcement";

export function useCourseAnnouncements(courseId: number) {
    const { data, isLoading, error } = useQuery<AnnouncementCourseResponse[]>({
        queryKey: ["courseAnnouncements", courseId],
        queryFn: () => getAnnouncementByCourseId(courseId),
        enabled: courseId > 0,
    });

    return {
        announcements: data ?? [],
        isLoading,
        error,
    };
}
