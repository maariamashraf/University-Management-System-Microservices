import axios from "axios";
import { getAuthHeaders } from "./config";
import { ApiUrl } from "./config";
import type { CourseRequest } from "../Interfaces/course";
export function getBackgroundColor(department: string) {
    switch (department) {
        case "Computer_Science":
            return "bg-gradient-to-br from-blue-400 to-blue-600";
        case "Information_Systems":
            return "bg-gradient-to-br from-green-400 to-green-600";
        case "Software_Engineering":
            return "bg-gradient-to-br from-orange-400 to-orange-600";
        case "Artificial_Intelligence":
            return "bg-gradient-to-br from-pink-400 to-pink-600";
        case "Data_Science":
            return "bg-gradient-to-br from-teal-400 to-teal-600";
        case "Cybersecurity":
            return "bg-gradient-to-br from-indigo-400 to-indigo-600";
    }
    return "bg-gradient-to-br from-indigo-400 to-indigo-600";
}

export function getDepartmentIcon(department: string) {
    switch (department) {
        case "Computer Science":
            return "💻";
        case "Mathematics":
            return "📐";
        case "Physics":
            return "⚛️";
        case "Chemistry":
            return "🧪";
        case "Computer_Science":
            return "💻";
        case "Information_Systems":
            return "📱";
        case "Software_Engineering":
            return "👨‍💻";
        case "Artificial_Intelligence":
            return "🤖";
        case "Data_Science":
            return "💻";
        case "Cybersecurity":
            return "🛡️";
    }
    return "📚";
}

export function isCourseFull(enrolledStudents: number, maxStudents: number) {
    return enrolledStudents >= maxStudents;
}

export function getCourseEnrollButtonStyle(enrolledStudents: number, maxStudents: number) {
    if (isCourseFull(enrolledStudents, maxStudents)) {
        return "bg-red-400 cursor-not-allowed";
    }
    return "bg-blue-500  cursor-pointer";
}


export async function getAllCourses() {
    try {
        const response = await axios.get(`${ApiUrl}/api/courses/all`, {
            headers: getAuthHeaders(),
        });
        // Backend returns a plain array with different field names — map to the course interface
        return (response.data as any[]).map((c) => ({
            ...c,
            department:  c.department,
            teacherName: c.teacherUserName,
            credits:     c.creditHours,
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) throw new Error(error.response.data.message);
            if (error.request)  throw new Error("No response from server");
        }
        throw new Error("Error fetching courses");
    }
}

export async function getCourseById(courseId: number) {
    try {
        console.log("Fetching course with id:", courseId);
        const response = await axios.get(`${ApiUrl}/api/courses/${courseId}`, {
            headers: getAuthHeaders(),
        });
        const c = response.data;
        return {
            ...c,
            // Keep course-details UI compatible with both old/new backend field names.
            department: c.department ?? c.departmentName,
            teacherName: c.teacherName ?? c.teacherUserName,
            credits: c.credits ?? c.creditHours,
            enrolledStudents: c.enrolledStudents ?? c.enrolledCount,
            teacherUserName: c.teacherUserName ?? c.teacherName,
            creditHours: c.creditHours ?? c.credits,
        };
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching course");
    }
}



export async function createCourse(course: CourseRequest) {
    try {
        console.log("Creating course with data:", course);

        console.log("url : ", `${ApiUrl}/api/courses`);
        const response = await axios.post(`${ApiUrl}/api/courses`, course, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response:", error.response.data);
                throw new Error(error.response.data.message);
            }   
            if(error.request){
                console.error("No response received:", error.request);
                throw new Error("No response from server");
            }
        }
        console.error("Error creating course:", error);
        throw new Error("Error creating course");
    }

}
export async function updateCourse(id:number, course: CourseRequest) {
    try {
        console.log("Updating course with id:", id, "and data:", course);
        const response = await axios.put(`${ApiUrl}/api/courses/${id}`, course, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("Error updating course");
    }
}

export async function deleteCourse(id:number) {
    try {
        const response = await axios.delete(`${ApiUrl}/api/courses/${id}`, {
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
        throw new Error("Error deleting course");
    }
}
export async function getAllCoursesByTeacherId(teacherId: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/courses/teacher/${teacherId}`, {
            headers: getAuthHeaders(),
        });
        return (response.data as any[]).map((c) => {
            const enrolledStudents = Number(c.enrolledStudents ?? c.enrolledCount ?? 0);
            const maxStudents = Number(c.maxStudents ?? 0);

            return {
                ...c,
                department: c.department ?? c.departmentName,
                teacherName: c.teacherName ?? c.teacherUserName,
                credits: Number(c.credits ?? c.creditHours ?? 0),
                enrolledStudents: Number.isFinite(enrolledStudents) ? enrolledStudents : 0,
                maxStudents: Number.isFinite(maxStudents) ? maxStudents : 0,
                teacherUserName: c.teacherUserName ?? c.teacherName,
                creditHours: Number(c.creditHours ?? c.credits ?? 0),
            };
        });
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }      
    throw new Error("Error fetching teacher courses");
    }
}
export async function getAllStudentsByCourseId(courseId: number) {
    try {
        const response = await axios.get(`${ApiUrl}/api/enrolled-courses/course/${courseId}`, {
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
        throw new Error("Error fetching students by course id");
    }
}

export async function getMostPopularCourses() {
    try {
        const response = await axios.get(`${ApiUrl}/api/courses/popular`, { 
            headers: getAuthHeaders(),
        });
        return response.data;
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                console.error("Error response:", error.response.data);
                throw new Error(error.response.data.message);
            }
            if(error.request){
                console.error("No response received:", error.request);
                throw new Error("No response from server");
            }
        }
        throw new Error("Error fetching popular courses");
    }   
}