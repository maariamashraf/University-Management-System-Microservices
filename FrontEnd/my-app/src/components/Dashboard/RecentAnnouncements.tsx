import { motion,AnimatePresence } from "framer-motion";
import { getAnnouncementIconAndColor } from "../../utils/announcementUtils";
import { useAnnouncementsHook } from "../../CustomeHooks/AnnounncemntHook/UseAnnouncementsHook";
import type { AnnouncementCourseResponse } from "../../Interfaces/announcement";
import { Bell } from "lucide-react";


export default function RecentAnnouncements() {

const { announcements } = useAnnouncementsHook() as { announcements: AnnouncementCourseResponse[] };

function getTimeAgo(createdAt: string) {
    return new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Announcements</h2>
            <AnimatePresence>
            <div className="space-y-1 flex-1">
            {announcements.slice(0, 3).map((announcement) => (
                <motion.div
                    key={announcement.id}
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex gap-3 pl-4 py-3 border-l-3 border-blue-500"
                >
                    <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-800">{announcement.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{announcement.content}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{getTimeAgo(announcement.createdAt)}</span>
                    </div>
                </motion.div>
            ))}
            </div>
            </AnimatePresence>
            {announcements.length === 0 && (
                <div className="text-center text-gray-500 mt-10 text-xl font-medium">
                    No announcements at the moment.
                </div>
            )
            }
            {announcements.length > 0 && (
                <button className="w-full mt-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition font-medium">
                    View All Announcements
                </button>
            )}
        </div>
    );
}
