import { decodeToken, getToken } from "./authService";
import { getTeacherDetails } from "./teacherService";
import { getStudentInfo } from "./studentService";
import type { Student } from "../Interfaces/student";
import type { Teacher } from "../Interfaces/teacher";
import type { AdminUser, MyTokenPayload } from "../Interfaces/Auth";
import { jwtDecode } from "jwt-decode";


export function getRole(): "teacher" | "student" | "admin" {
    try {
        const { roles } = jwtDecode<MyTokenPayload>(getToken() ?? "");
        if (roles.includes("Admin")) return "admin";
        return roles.includes("Teacher") ? "teacher" : "student";
    } catch {
        return "student";
    }
}

export async function getUserDashboardData(token: string): Promise<Student | Teacher | AdminUser> {
    const decoded = await decodeToken(token);
    const userId = decoded.userId;
     console.log("Decoded token:", decoded);
    if (decoded.roles.includes("Admin")) {
        return {
            role: "admin",
            id: userId,
            username: decoded.userName,
            email: decoded.sub,
        };
    }

    if (decoded.roles.includes("Teacher")) {
        const data = await getTeacherDetails(userId);
        console.log("Teacher data:", data);
        return { ...data, role: "teacher" } as Teacher;
    }

    const data = await getStudentInfo(userId);
    console.log("Student data:", data);
    return { ...data, role: "student" } as Student;
}
