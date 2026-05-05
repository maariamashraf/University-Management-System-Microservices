import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { Student } from "../Interfaces/student";

interface StudentBffResponse {
    profile: Student;
    enrollments: unknown[];
    courses: unknown[];
}

/**
 * BFF Pattern Implementation
 * 
 * This service now calls the API Gateway's BFF endpoint (/api/gateway/dashboard/student/{id})
 * instead of calling the Student Service directly.
 * 
 * Benefits:
 * - Centralized routing through the gateway
 * - Server-side data aggregation capability
 * - Simplified frontend service discovery
 * - Better security through gateway-managed authentication
 */
export async function getStudentInfo(_id: number): Promise<Student> {
    try {
        // Updated to use BFF endpoint through API Gateway
        const response = await axios.get<StudentBffResponse>(`${ApiUrl}/api/gateway/dashboard/student/${_id}`, {
            headers: getAuthHeaders(),
        });
        console.log("Student info fetched via BFF endpoint");
        return response.data.profile;
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
