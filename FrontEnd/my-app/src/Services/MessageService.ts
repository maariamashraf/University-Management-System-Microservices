import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { MessageRequest, MessageResponse } from "../Interfaces/message";

export async function getMessagesByCourse(courseId: number): Promise<MessageResponse[]> {
    try {
        const response = await axios.get(`${ApiUrl}/api/messages/course/${courseId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request) throw new Error("No response from server");
        }
        throw new Error("Error fetching messages");
    }
}

export async function sendMessage(request: MessageRequest): Promise<void> {
    try {
        await axios.post(`${ApiUrl}/api/messages`, request, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request) throw new Error("No response from server");
        }
        throw new Error("Error sending message");
    }
}

export async function deleteMessage(messageId: number): Promise<void> {
    try {
        await axios.delete(`${ApiUrl}/api/messages/${messageId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request) throw new Error("No response from server");
        }
        throw new Error("Error deleting message");
    }
}
