import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle } from "lucide-react";              // ← lucide bell icon
import { useNotifications } from "../../CustomeHooks/Notifications/useNotifications";
import type { NotificationMessage } from "../../Interfaces/Notification";

// NotificationToast.tsx is now DELETED — react-hot-toast replaced it

const TYPE_ICONS: Record<string, string> = {
    ENROLLMENT:    "🎓",
    ANNOUNCEMENT:  "📢",
    COURSE_UPDATE: "📝",
    GRADE:         "✅",
    SYSTEM:        "🔔",
};

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        connected,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    } = useNotifications();

    // close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const formatTime = (dateStr: string): string => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    const handleItemClick = (n: NotificationMessage) => {
        if (!n.read) markNotificationAsRead(n.id);
    };

    const handleMarkAllNotificationsAsRead = () => {
        markAllNotificationsAsRead();
    };

    return (
        // no <>...</> wrapper needed anymore — toast is handled by <Toaster /> in App.tsx
        <div className="relative" ref={dropdownRef}>

            {/* ── BELL BUTTON ── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                {/* lucide Bell icon — replaces the manual SVG path */}
                <Bell
                    size={22}
                    className={`transition-colors ${unreadCount > 0 ? "text-gray-800" : "text-gray-500"
                        }`}
                    // optional: add a subtle shake animation when there are unread
                    style={unreadCount > 0 ? { animation: "ring 0.5s ease" } : {}}
                />

                {/* red unread count badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5
                           min-w-[18px] h-[18px] bg-red-500 text-white
                           text-[10px] font-bold rounded-full
                           flex items-center justify-center px-1
                           border-2 border-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}

                {/* websocket connection status dot */}
                <span
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full
                      border-2 border-white transition-colors
                      ${connected ? "bg-green-400" : "bg-gray-300"}`}
                />
            </button>

            {/* ── DROPDOWN ── */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl
                        shadow-2xl border border-gray-100 z-50 overflow-hidden">

                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-gray-600" />
                            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-[10px]
                                 font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllNotificationsAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800
                        font-medium flex items-center gap-1 cursor-pointer"
                            >
                                <CheckCircle size={13} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* notification list */}
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center py-14 text-gray-400">
                                <Bell size={32} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium">You're all caught up!</p>
                                <p className="text-xs mt-1 opacity-70">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleItemClick(n)}
                                    className={`flex items-start gap-3 px-5 py-4
                            cursor-pointer transition-colors
                            ${!n.read
                                            ? "bg-blue-50 hover:bg-blue-100"
                                            : "hover:bg-gray-50"}`}
                                >
                                    {/* type icon */}
                                    <span className="text-lg shrink-0 mt-0.5">
                                        {TYPE_ICONS[n.type] ?? "🔔"}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm truncate ${!n.read ? "font-semibold text-gray-900"
                                                : "font-medium text-gray-600"
                                            }`}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTime(n.createdAt)}
                                        </p>
                                    </div>

                                    {/* unread blue dot */}
                                    {!n.read && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* footer */}
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t bg-gray-50 text-center">
                            <button
                            onClick={handleMarkAllNotificationsAsRead}
                            className="text-xs text-blue-600 hover:underline font-medium cursor-pointer">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;