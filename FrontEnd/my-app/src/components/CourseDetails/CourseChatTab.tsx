import { useState, useRef, useEffect } from "react";
import { Send, GraduationCap } from "lucide-react";
import { getAvatarInitials } from "../../utils/avatarUtils";
import { useCourseMessages } from "../../CustomeHooks/CourseDetails/UseCourseMessages";
import type { MessageResponse } from "../../Interfaces/message";
import { useGetCourseById } from "../../CustomeHooks/CoursesHooks/UseGetCourseById";

interface CourseChatTabProps {
    courseId: number;
    currentUserId: number;
    currentUserName: string;
}

function ChatBubble({
    message,
    isOwn,
    teacherUserName,
}: {
    message: MessageResponse;
    isOwn: boolean;
    teacherUserName: string;
}) {
    const initials = getAvatarInitials(message.senderName);
    const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isTeacher = message.senderName === teacherUserName;

    const avatarClass = isOwn
        ? "bg-blue-600"
        : isTeacher
        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-emerald-300"
        : "bg-indigo-400";

    const bubbleClass = isOwn
        ? "bg-blue-600 text-white rounded-tr-sm"
        : isTeacher
        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300 text-gray-800 rounded-tl-sm"
        : "bg-gray-100 text-gray-800 rounded-tl-sm";

    return (
        <div className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <div
                className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${avatarClass}`}
            >
                {initials}
            </div>
            <div className={`max-w-xs ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                    {!isOwn && (
                        <div className="flex items-center gap-1.5">
                            {isTeacher ? (
                                <>
                                    <GraduationCap size={13} className="text-emerald-600 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-700 tracking-wide">
                                        {message.senderName}
                                    </span>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        Teacher
                                    </span>
                                </>
                            ) : (
                                <span className="text-xs font-semibold text-indigo-500">
                                    {message.senderName}
                                </span>
                            )}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-400">{time}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${bubbleClass}`}>
                    {message.content}
                </div>
            </div>
        </div>
    );
}

export default function CourseChatTab({
    courseId,
    currentUserId,
    currentUserName,
}: CourseChatTabProps) {
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const { messages, isLoading, postMessage, isSending } = useCourseMessages(courseId);
    const { course } = useGetCourseById(courseId.toString());
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        const trimmed = text.trim();
        if (!trimmed || isSending) return;
        const sent = await postMessage({ courseId, senderId: currentUserId, content: trimmed });
        if (sent) {
            setText("");
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col h-[calc(100vh-260px)] min-h-96">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-base font-bold text-gray-800">Course Chat</h3>
                <span className="text-xs text-gray-400 ml-1">· Live</span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">
                        No messages yet. Start the conversation!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <ChatBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === currentUserId}
                            teacherUserName={course?.teacherUserName ?? ""}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message as ${currentUserName}...`}
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button
                    onClick={() => void handleSend()}
                    disabled={!text.trim() || isSending}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
