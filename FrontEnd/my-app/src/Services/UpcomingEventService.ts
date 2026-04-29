import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { UpcomingEventResponse } from "../Interfaces/upComingEvent";

export async function getEventsByUser(userId: number): Promise<UpcomingEventResponse[]> {
    try {
        const response = await axios.get(`${ApiUrl}/api/events/user/${userId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request) throw new Error("No response from server");
        }
        throw new Error("Error fetching events");
    }
}

export async function getUpcomingEvents(): Promise<UpcomingEventResponse[]> {
    try {
        const response = await axios.get(`${ApiUrl}/api/events/upcoming`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request) throw new Error("No response from server");
        }
        throw new Error("Error fetching upcoming events");
    }
}
