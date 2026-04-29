import { useEffect, useState } from "react";
import { webSocketService } from "../../Services/WebSocketService";
import type { AnnouncementCourseResponse } from "../../Interfaces/announcement";
import { useCallback } from "react";
import { getAllAnnouncements } from "../../Services/AnnouncmentService";
import { toast } from "sonner";

export const useAnnouncementsHook = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementCourseResponse[]>([]);


    const handleNewAnnouncement = useCallback((announcement: AnnouncementCourseResponse) => {
        setAnnouncements((prev) => {
            const alreadyExists = prev.some((a) => a.id === announcement.id);
            if (alreadyExists) return prev; 
            return [  announcement,...prev];
        });
        toast.success(`New announcement received: ${announcement.title}`);
    }, []);

    const fetchAnnouncements = useCallback(async () => {
        try {
            const response = await getAllAnnouncements();
            setAnnouncements(response);
        
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    }, []);

    useEffect(() => {
        webSocketService.subscribeToAnnouncements(handleNewAnnouncement);
        fetchAnnouncements();

        return () => {
            webSocketService.unsubscribeFromAnnouncements();
        }
    }, [fetchAnnouncements, handleNewAnnouncement]);

    return {
        announcements
    };

}
