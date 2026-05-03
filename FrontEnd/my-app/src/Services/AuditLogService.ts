import axios from "axios";
import { ApiUrl, getAuthHeaders } from "./config";
import type { AuditLog } from "../Interfaces/auditLog";

function mapAuditLog(dto: AuditLog): AuditLog {
    return {
        id: Number(dto.id),
        userId: Number(dto.userId),
        userName: dto.userName,
        action: dto.action,
        details: dto.details,
        ipAddress: dto.ipAddress,
        createdAt: dto.createdAt,
    };
}

function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback;
    const payload = error.response?.data;
    if (typeof payload === "string" && payload.trim().length > 0) return payload;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }
    if (error.request) return "No response from server";
    return fallback;
}

export async function getAllAuditLogs(): Promise<AuditLog[]> {
    try {
        const response = await axios.get<AuditLog[]>(`${ApiUrl}/api/audit-logs`, {
            headers: getAuthHeaders(),
        });
        return response.data.map(mapAuditLog);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Error fetching audit logs"));
    }
}

export async function getAuditLogsByAction(action: string): Promise<AuditLog[]> {
    try {
        const response = await axios.get<AuditLog[]>(`${ApiUrl}/api/audit-logs/action/${action}`, {
            headers: getAuthHeaders(),
        });
        return response.data.map(mapAuditLog);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Error fetching audit logs"));
    }
}

export async function getLastWeekStudentsLogs(): Promise<AuditLog[]> {
    try {
        const response = await axios.get<AuditLog[]>(`${ApiUrl}/api/audit-logs/last-week-students-logs`, {
            headers: getAuthHeaders(),
        });
        return response.data.map(mapAuditLog);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Error fetching last week students logs"));
    }
}

export async function getLastWeekTeachersLogs(): Promise<AuditLog[]> {
    try {
        const response = await axios.get<AuditLog[]>(`${ApiUrl}/api/audit-logs/last-week-teachers-logs`, {
            headers: getAuthHeaders(),
        });
        return response.data.map(mapAuditLog);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Error fetching last week teachers logs"));
    }
}

export async function getLastWeekAdminsLogs(): Promise<AuditLog[]> {
    try {
        const response = await axios.get<AuditLog[]>(`${ApiUrl}/api/audit-logs/last-week-admins-logs`, {
            headers: getAuthHeaders(),
        });
        return response.data.map(mapAuditLog);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Error fetching last week admins logs"));
    }
}
