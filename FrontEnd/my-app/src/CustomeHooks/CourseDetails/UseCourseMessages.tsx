import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesByCourse, sendMessage } from "../../Services/MessageService";
import type { MessageResponse, MessageRequest } from "../../Interfaces/message";
import { useCallback, useEffect, useState } from "react";
import { webSocketService } from "../../Services/WebSocketService";
import { toast } from "sonner";

export function useCourseMessages(courseId: number) {
    const queryClient = useQueryClient();
    const [isSending, setIsSending] = useState(false);
    const { data, isLoading, error } = useQuery<MessageResponse[]>({
        queryKey: ["courseMessages", courseId],
        queryFn: () => getMessagesByCourse(courseId),
        enabled: courseId > 0,
    });

    const handleNewMessage = useCallback((message: MessageResponse) => {
        queryClient.setQueryData<MessageResponse[]>(
            ["courseMessages", courseId],
            (prev) => {
                if (!prev) return [message];
                console.log("Received new message", message);
                // prevent duplicate if REST and WebSocket both deliver same message
                const alreadyExists = prev.some((m) => m.id === message.id);
                if (alreadyExists) return prev;

                // append to end — chat is oldest first
                return [...prev, message];
            }
        );
    }, [courseId, queryClient]);

    useEffect(() => {
        if (courseId <= 0) {
            return;
        }
        webSocketService.subscribeToChat(courseId, handleNewMessage);
        return () => {
            webSocketService.unsubscribeFromChat(courseId);
        };
    }, [courseId, handleNewMessage]);


    const postMessage = useCallback(async (request: MessageRequest): Promise<boolean> => {
        setIsSending(true);
        try {
            await sendMessage(request);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to send message right now.";
            if (/access denied|missing required permission|permission|forbidden|denied/i.test(message)) {
                toast.error("You do not have permission to send messages in this course chat.");
            } else {
                toast.error(message);
            }
            return false;
        } finally {
            setIsSending(false);
        }
    }, []);

    return {
        messages: data ?? [],
        isLoading,
        error,
        postMessage,
        isSending,
    };
}
