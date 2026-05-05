import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { Teacher } from "../Interfaces/teacher";

interface TeacherBffResponse {
    profile: Teacher;
    courses: Teacher["courses"];
    coursesCount?: number;
}

/**
 * BFF Pattern Implementation
 * 
 * This service now calls the API Gateway's BFF endpoint (/api/gateway/dashboard/teacher/{id})
 * instead of calling the Teacher Service directly.
 * 
 * Benefits:
 * - Centralized routing through the gateway
 * - Server-side data aggregation capability
 * - Simplified frontend service discovery
 * - Better security through gateway-managed authentication
 */
export async function getTeacherInfo(id: number) {
    return getTeacherDetails(id);
}

export async function getTeacherDetails(_id: number): Promise<Teacher> {
    try {
        // Updated to use BFF endpoint through API Gateway
        const response = await axios.get<TeacherBffResponse>(`${ApiUrl}/api/gateway/dashboard/teacher/${_id}`, {
            headers: getAuthHeaders(),
        });
        console.log("Teacher details fetched via BFF endpoint");

        const profile = response.data.profile;
        return {
            ...profile,
            courses: response.data.courses ?? profile.courses,
            coursesCount: response.data.coursesCount ?? (response.data.courses?.length ?? profile.coursesCount),
        };
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
