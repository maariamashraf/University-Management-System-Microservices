import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";

export async function getTeacherInfo(id: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/teachers/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("error.response", error.response.data);
                throw new Error(error.response.data.message || "Teacher info failed");
            }
            if (error.request) {
                console.log("error.request", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Teacher info failed. Please try again.");
    }
}

export async function getTeacherDetails(id: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/teachers/details/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("error.response", error.response.data);
                throw new Error(error.response.data.message || "Teacher details failed");
            }
            if (error.request) {
                console.log("error.request", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Teacher details failed. Please try again.");
    }
}
