import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";

export async function getStudentInfo(id: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/students/details/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("error.response", error.response.data);
                throw new Error(error.response.data.message || "Student info failed");
            }
            if (error.request) {
                console.log("error.request", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Student info failed. Please try again.");
    }
}
