import { decodeToken, getToken, getTokenRoles } from "./authService";
import { getTeacherDetails } from "./teacherService";
import { getStudentInfo } from "./studentService";
import type { Student } from "../Interfaces/student";
import type { Teacher } from "../Interfaces/teacher";
import type { AdminUser, MyTokenPayload } from "../Interfaces/Auth";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import {ApiUrl,getAuthHeaders} from "./config"
import axios from "axios";

/**
 * BFF (Backend for Frontend) Pattern Implementation
 * 
 * This service module implements the BFF pattern where:
 * 1. All frontend requests go through the API Gateway at /api/gateway/dashboard/*
 * 2. The gateway routes requests to appropriate backend services
 * 3. The gateway can aggregate and transform data before returning to frontend
 * 4. Frontend only knows about one endpoint (the gateway)
 * 
 * Service Flow:
 * Frontend → API Gateway (/api/gateway/dashboard/*) → Backend Services → API Gateway → Frontend
 */

function normalizeRole(role: string): string {
    return role.replace(/^ROLE_/, "").toLowerCase();
}

export function getRole(): "teacher" | "student" | "admin" {
    try {
        const roles = getTokenRoles(getToken() ?? "");
        if (roles.some((role) => normalizeRole(role) === "admin")) return "admin";
        return roles.some((role) => normalizeRole(role) === "teacher") ? "teacher" : "student";
    } catch {
        return "student";
    }
}

export async function deactivateUser(userId: number){
   if(getRole() !== "admin"){
    toast.error("You are not authorized to perform this action"); 
    return;
   }    
   try{
      await axios.post(`${ApiUrl}/api/users/${userId}/deactivate`, {}, {
         headers: getAuthHeaders(),
      })
      toast.success("User deactivated successfully");
   }
   catch(error){
    if(axios.isAxiosError(error)){
        if(error.response){
            throw new Error(error.response.data.message);
        }
        if(error.request){
            throw new Error("No response from server");
        }
    }
    throw new Error("An error occurred while deactivating the user");
   }
}

export async function activateUser(userId: number){
    if(getRole() !== "admin"){
        toast.error("You are not authorized to perform this action"); 
    return;
   }    
       try{
          await axios.post(`${ApiUrl}/api/users/${userId}/activate`, {}, {
             headers: getAuthHeaders(),
          })
          toast.success("User activated successfully");
       }
       catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
    throw new Error("An error occurred while activating the user");
       }
}

export async function getUserDashboardData(token: string): Promise<Student | Teacher | AdminUser> {
    const decoded = await decodeToken(token);
    const userId = decoded.userId;
     console.log("Decoded token:", decoded);
    const roles = getTokenRoles(token);
    if (roles.some((role) => normalizeRole(role) === "admin")) {
        return {
            role: "admin",
            id: userId,
            username: decoded.userName ?? decoded.sub,
            email: decoded.email ?? decoded.sub,
        };
    }

    if (roles.some((role) => normalizeRole(role) === "teacher")) {
        const data = await getTeacherDetails(userId);
        console.log("Teacher data:", data);
        return { ...data, role: "teacher" } as Teacher;
    }

    const data = await getStudentInfo(userId);
    console.log("Student data:", data);
    return { ...data, role: "student" } as Student;
}
