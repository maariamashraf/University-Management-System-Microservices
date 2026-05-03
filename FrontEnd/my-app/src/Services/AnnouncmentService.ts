import axios from "axios";
import { ApiUrl } from "./config";
import { getAuthHeaders } from "./config";
import type { AnnouncementCreateRequest } from "../Interfaces/announcement";


export async function getAllAnnouncements() {
    try {
        const response = await axios.get(`${ApiUrl}/api/announcements/getAll`, {
            headers: getAuthHeaders(),
        });
        console.log("Announcements from service:", response.data);
        return response.data;
        
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.log("Error from service:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                console.log("No response from server:", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching announcements");
    }

}


export async function getAnnouncementByCourseId(courseId: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/announcements/course/${courseId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching announcements");
    }
}

export async function createAnnouncement(payload: AnnouncementCreateRequest) {
    try {
        await axios.post(`${ApiUrl}/api/announcements/create`, payload, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message ?? "Failed to create announcement");
            }
            if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Error creating announcement");
    }
}

export async function getAllAnnouncementsByStudentId(studentId: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/announcements/student/${studentId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching announcements");
    }
}

export async function getAllAnnouncementsByTeacherId(teacherId: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/announcements/teacher/${teacherId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            if (error.request) { 
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching announcements");
    }
}