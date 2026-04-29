import axios from "axios";
import { ApiUrl, getAuthHeaders, getHeaders } from "./config";

export async function getRecentFeedbacks() {
    try {
        const response = await axios.get(`${ApiUrl}/api/feedbacks/recent`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error getting recent feedbacks:", error.response.data);
                throw new Error(`Failed to fetch recent feedbacks: ${error.response.status} ${error.response.statusText}`);
            }
            if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("Failed to fetch recent feedbacks: No response received from the server.");
            }
            throw new Error("Failed to fetch recent feedbacks: An unexpected error occurred.");
        }
    }
}