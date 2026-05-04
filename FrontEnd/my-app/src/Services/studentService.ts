import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { Student } from "../Interfaces/student";

export async function getStudentInfo(_id: number): Promise<Student> {
    try {
        const response = await axios.get<Student>(`${ApiUrl}/api/students/details/${_id}`, {
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
