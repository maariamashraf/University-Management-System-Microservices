import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncement } from "../../Services/AnnouncmentService";
import type { AnnouncementCreateRequest } from "../../Interfaces/announcement";

export function useCreateCourseAnnouncement(courseId: number) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: AnnouncementCreateRequest) => createAnnouncement(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["courseAnnouncements", courseId],
            });
        },
    });

    return {
        createCourseAnnouncement: mutation.mutateAsync,
        isCreating: mutation.isPending,
        createError: mutation.error instanceof Error ? mutation.error.message : null,
    };
}
