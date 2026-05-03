import axios from "axios";
import { ApiUrl } from "./config";
import { getAuthHeaders } from "./config";
import type { EnrolledCourseRequest } from "../Interfaces/enrolledCourse";
import { assertPermission } from "./authService";
import { getRole } from "./userService";

export async function getAllEnrolledCourses() {
    try {
        const response = await axios.get(`${ApiUrl}/api/enrolled-courses`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching enrolled courses");
    }

}
export async function getEnrolledCoursesByStudentId(studentId: number) {
    console.log("Fetching enrolled courses for studentId from service layer:", studentId);
    try {
        const response = await axios.get(`${ApiUrl}/api/enrolled-courses/student/${studentId}`, {
            headers: getAuthHeaders(),
        });
            console.log("Received response for enrolled courses:", response.data);    
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response from server:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                console.error("No response received from server:", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching enrolled courses");
    }
}
export async function getEnrolledCoursesByCourseId(courseId: number) {
    console.log("Fetching enrolled courses for courseId:", courseId);
    try {
        const response = await axios.get(`${ApiUrl}/api/enrolled-courses/course/${courseId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response from server:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                console.error("No response received from server:", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching enrolled courses");
    }
}
export async function getEnrolledCourseById(id: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/enrolled-courses/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching enrolled course");
    }
}
export async function enrollStudentInCourse(enrolledCourseRequest: EnrolledCourseRequest) {
    try {
        console.log("Asserting permission:", "course_register");
        assertPermission("course_register");
        console.log("Enrolling student in course:", enrolledCourseRequest);
        const response = await axios.post(`${ApiUrl}/api/enrolled-courses`, enrolledCourseRequest, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response from server:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                console.error("No response received from server:", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Error enrolling student in course");
    }
}
export async function unenrollStudentFromCourse(id: number) {

    try {
        const role = getRole();
        const isTeacher = role === "teacher";
        assertPermission(isTeacher ? "unenroll_student" : "unenroll_course");
        const endpoint = isTeacher
            ? `${ApiUrl}/api/enrolled-courses/teacher/${id}`
            : `${ApiUrl}/api/enrolled-courses/student/${id}`;
        console.log("Unenrolling student from course:", id);
        const response = await axios.delete(endpoint, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }   
        }
        if (error instanceof Error) throw error;
        throw new Error("Error unenrolling student from course");
    }
}
