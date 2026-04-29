import type { Student } from "./student";
import type { Teacher } from "./teacher";

export interface AdminUser {
    role: "admin";
    id: number;
    username: string;
    email: string;
}

export type AuthUser = Student | Teacher | AdminUser;

export interface AuthContextType {
    isError: string | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, username: string, teacherCode?: string) => Promise<void>;
}
export interface MyTokenPayload {
    roles: string[];
    userName: string;
    userId: number;
    sub: string;     
    iat: number;       
    exp: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    teacherCode?: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}
