import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationMessage } from "../Interfaces/Notification";
import type { AnnouncementCourseResponse } from "../Interfaces/announcement";
import type { MessageRequest, MessageResponse, TypingPayload } from "../Interfaces/message";
import { getToken } from "../Services/authService";
import { ApiUrl } from "./config";
import { toast } from "sonner";

type NotificationHandler = (n: NotificationMessage) => void;
type AnnouncementHandler = (a: AnnouncementCourseResponse) => void;
type MessageHandler = (m: MessageResponse) => void;
type TypingHandler = (t: TypingPayload) => void;

// store everything needed to resubscribe after reconnect
interface ChatHandlers {
    onMessage: MessageHandler;
    onTyping?: TypingHandler;
    messageSub: StompSubscription | null;
    typingSub: StompSubscription | null;
}

class WebSocketService {
    private client: Client | null = null;
    private connected = false;
    private pendingCallbacks: (() => void)[] = [];

    // ✅ store ALL registered handlers so we can resubscribe after reconnect
    private notificationHandler: NotificationHandler | null = null;
    private announcementHandler: AnnouncementHandler | null = null;
    private chatHandlers: Map<number, ChatHandlers> = new Map();

    // individual subscriptions
    private notifSub: StompSubscription | null = null;
    private announcementSub: StompSubscription | null = null;

    // ── get token fresh every time — not at import time ──────────────────────
    private getAuthToken(): string {
        return getToken() || "";  // ✅ called when needed, not at startup
    }

    // ── creates and activates the STOMP client ───────────────────────────────
    private createClient(): void {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${ApiUrl}/ws`),
            connectHeaders: {
                // ✅ token read fresh at connection time
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected");
                this.connected = true;

                // ✅ resubscribe ALL handlers after every connect/reconnect
                // this fixes the "works after refresh" bug
                this.resubscribeAll();

                // drain pending callbacks
                const callbacks = [...this.pendingCallbacks];
                this.pendingCallbacks = [];
                callbacks.forEach((cb) => cb());
            },

            onDisconnect: () => {
                console.log("❌ WebSocket disconnected");
                this.connected = false;
                // clear old subscription objects — they are dead after disconnect
                // handlers are kept so resubscribeAll() can restore them
                this.notifSub = null;
                this.announcementSub = null;
                this.chatHandlers.forEach((handlers) => {
                    handlers.messageSub = null;
                    handlers.typingSub = null;
                });
            },

            onStompError: (frame) => {
                const serverMessage = this.extractServerErrorMessage(frame);
                console.error("STOMP error:", serverMessage);

                if (this.isPermissionDeniedMessage(serverMessage)) {
                    toast.error("You do not have permission to send messages in this course chat.");
                    return;
                }

                toast.error(serverMessage || "Unable to send message right now. Please try again.");
            },
        });

        this.client.activate();
    }

    private extractServerErrorMessage(frame: { headers: Record<string, string>; body?: string }): string {
        const headerMessage = frame.headers?.message;
        const body = frame.body?.trim();

        if (body) {
            try {
                const parsed = JSON.parse(body) as { message?: string; error?: string };
                const jsonMessage = parsed?.message || parsed?.error;
                if (jsonMessage) return jsonMessage;
            } catch {
                // If body is plain text, use it directly.
                return body;
            }
        }

        return headerMessage || "WebSocket error";
    }

    private isPermissionDeniedMessage(message: string): boolean {
        return /access denied|missing required permission|permission|forbidden|denied/i.test(message);
    }

    // ── resubscribes ALL active handlers ─────────────────────────────────────
    // called after every connect and reconnect
    private resubscribeAll(): void {
        if (!this.client) return;

        // resubscribe notifications
        if (this.notificationHandler) {
            this.notifSub = this.client.subscribe(
                `/user/queue/notifications`,
                (frame) => {
                    const notification: NotificationMessage = JSON.parse(frame.body);
                    this.notificationHandler!(notification);
                }
            );
        }

        // resubscribe announcements
        if (this.announcementHandler) {
            this.announcementSub = this.client.subscribe(
                `/topic/announcements`,
                (frame) => {
                    const announcement: AnnouncementCourseResponse = JSON.parse(frame.body);
                    this.announcementHandler!(announcement);
                }
            );
        }

        // resubscribe all active course chats
        this.chatHandlers.forEach((handlers, courseId) => {
            handlers.messageSub = this.client!.subscribe(
                `/topic/course/${courseId}`,
                (frame) => {
                    const message: MessageResponse = JSON.parse(frame.body);
                    handlers.onMessage(message);
                }
            );
            if (handlers.onTyping) {
                handlers.typingSub = this.client!.subscribe(
                    `/topic/course/${courseId}.typing`,
                    (frame) => {
                        const typing: TypingPayload = JSON.parse(frame.body);
                        handlers.onTyping!(typing);
                    }
                );
            }
        });
    }

    // ── ensures connection exists ────────────────────────────────────────────
    private ensureConnected(onReady: () => void): void {
        if (this.connected) {
            onReady();
            return;
        }

        this.pendingCallbacks.push(onReady);

        // only create client once — even if ensureConnected called multiple times
        if (!this.client) {
            this.createClient();
        }
    }

    // ── NOTIFICATIONS ────────────────────────────────────────────────────────
    connect(
        _userId: number,
        onNotification: NotificationHandler,
        onConnected?: () => void
    ): void {
        // ✅ save handler for resubscription after reconnect
        this.notificationHandler = onNotification;

        this.ensureConnected(() => {
            // resubscribeAll() already handled it in onConnect
            // just call the callback
            onConnected?.();
        });
    }

    // ── ANNOUNCEMENTS ────────────────────────────────────────────────────────
    subscribeToAnnouncements(onAnnouncement: AnnouncementHandler): void {
        // ✅ save handler for resubscription after reconnect
        this.announcementHandler = onAnnouncement;

        this.ensureConnected(() => {
            // resubscribeAll() already handled it
        });
    }

    unsubscribeFromAnnouncements(): void {
        this.announcementSub?.unsubscribe();
        this.announcementSub = null;
        this.announcementHandler = null; // clear so reconnect doesn't restore it
    }

    // ── CHAT ─────────────────────────────────────────────────────────────────
    subscribeToChat(
        courseId: number,
        onMessage: MessageHandler,
        onTyping?: TypingHandler
    ): void {
        // ✅ always update handlers — even if courseId already exists
        // this fixes the "works only once" bug
        this.chatHandlers.set(courseId, {
            onMessage,
            onTyping,
            messageSub: null,
            typingSub: null,
        });

        this.ensureConnected(() => {
            // resubscribeAll() handles the actual subscription
            // but if we're already connected, do it immediately
            if (this.connected && this.client) {
                const handlers = this.chatHandlers.get(courseId)!;

                // unsubscribe old subs if they exist (handles resubscription)
                handlers.messageSub?.unsubscribe();
                handlers.typingSub?.unsubscribe();

                handlers.messageSub = this.client.subscribe(
                    `/topic/course/${courseId}`,
                    (frame) => {
                        const message: MessageResponse = JSON.parse(frame.body);
                        handlers.onMessage(message);
                    }
                );
                if (handlers.onTyping) {
                    handlers.typingSub = this.client.subscribe(
                        `/topic/course/${courseId}.typing`,
                        (frame) => {
                            const typing: TypingPayload = JSON.parse(frame.body);
                            handlers.onTyping!(typing);
                        }
                    );
                }
            }
        });
    }

    sendChatMessage(courseId: number, request: MessageRequest): void {
        if (!this.connected || !this.client) return;

        this.client.publish({
            destination: `/app/course/${courseId}`,
            body: JSON.stringify(request),
        });
    }

    sendTypingEvent(
        courseId: number,
        senderId: number,
        senderName: string,
        isTyping: boolean
    ): void {
        if (!this.connected || !this.client) return;

        this.client.publish({
            destination: `/app/course/${courseId}.typing`,
            body: JSON.stringify({ senderId, senderName, isTyping }),
        });
    }

    unsubscribeFromChat(courseId: number): void {
        const handlers = this.chatHandlers.get(courseId);
        if (handlers) {
            handlers.messageSub?.unsubscribe();
            handlers.typingSub?.unsubscribe();
            this.chatHandlers.delete(courseId); // ✅ remove handlers too
        }
    }

    // ── FULL DISCONNECT — only on logout ─────────────────────────────────────
    disconnect(): void {
        this.notifSub?.unsubscribe();
        this.announcementSub?.unsubscribe();
        this.chatHandlers.forEach(({ messageSub, typingSub }) => {
            messageSub?.unsubscribe();
            typingSub?.unsubscribe();
        });

        this.notificationHandler = null;
        this.announcementHandler = null;
        this.chatHandlers.clear();
        this.notifSub = null;
        this.announcementSub = null;
        this.pendingCallbacks = [];

        this.client?.deactivate();
        this.client = null;
        this.connected = false;
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const webSocketService = new WebSocketService();