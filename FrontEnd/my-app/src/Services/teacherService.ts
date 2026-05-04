import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { Teacher } from "../Interfaces/teacher";

export async function getTeacherInfo(id: number) {
    return getTeacherDetails(id);
}

export async function getTeacherDetails(_id: number): Promise<Teacher> {
    try {
        const response = await axios.get<Teacher>(`${ApiUrl}/api/teachers/details/${_id}`, {
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
