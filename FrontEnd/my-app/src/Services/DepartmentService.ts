import { ApiUrl } from "./config";
import { getHeaders } from "./config";
import axios from "axios";

export async function getDepartments() {
    try {
        const response = await axios.get(`${ApiUrl}/api/departments/all`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                throw new Error(
                    `Failed to fetch departments: ${error.response.status} ${error.response.statusText}`,
                );
            }
            if (error.request) {
                console.error("No response received:", error.request);
                throw new Error(
                    "Failed to fetch departments: No response received from the server.",
                );
            }
        }
        throw new Error(
            "Failed to fetch departments: An unexpected error occurred.",
        );
    }
}
