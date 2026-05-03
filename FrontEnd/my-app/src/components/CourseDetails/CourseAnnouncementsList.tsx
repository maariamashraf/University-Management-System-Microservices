import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import type { AnnouncementCourseResponse } from "../../Interfaces/announcement";

interface CourseAnnouncementsListProps {
    announcements: AnnouncementCourseResponse[];
    canCreate: boolean;
    onCreateClick: () => void;
}

function AnnouncementItem({ announcement }: { announcement: AnnouncementCourseResponse }) {
    const timeAgo = new Date(announcement.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
        >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Bell size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800 truncate">{announcement.title}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{announcement.content}</p>
            </div>
        </motion.div>
    );
}

export default function CourseAnnouncementsList({ announcements, canCreate, onCreateClick }: CourseAnnouncementsListProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-gray-800">Announcements</h3>
                {canCreate ? (
                    <button
                        type="button"
                        onClick={onCreateClick}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                        + New Announcement
                    </button>
                ) : null}
            </div>

            {announcements.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No announcements yet.</p>
            ) : (
                <AnimatePresence>
                    <div>
                        {announcements.slice(0, 5).map((a) => (
                            <AnnouncementItem key={a.id} announcement={a} />
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
        //TODO: the announcements do not send notifications to the students or appear in their dashboard
    );
}
