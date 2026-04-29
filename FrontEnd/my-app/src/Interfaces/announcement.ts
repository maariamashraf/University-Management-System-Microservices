export interface AnnouncementResponse {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    type?: "info" | "warning" | "success" | "default";
}
export interface AnnouncementCourseResponse {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    courseId: number;
}


export interface AnnouncementContextType{
    announcements: AnnouncementResponse[];
    setAnnouncements: (announcements: AnnouncementResponse[]) => void;
    createAnnouncement: (Announcement: AnnouncementResponse) => void;
    updateAnnouncement: (Announcement: AnnouncementResponse) => void;
    deleteAnnouncement: (announcementId: number) => void;
    getAnnouncementById: (announcementId: number) => AnnouncementResponse | null;
    isLoading: boolean;
    error: string | null;
}