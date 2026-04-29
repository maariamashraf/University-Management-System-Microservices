export interface MessageResponse {
    id: number;
    courseId: number;
    courseName: string;
    senderId: number;
    senderName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageRequest {
    courseId: number;
    senderId: number;
    content: string;
}
export interface TypingPayload {
    senderId: number;
    senderName: string;
    isTyping: boolean;
}