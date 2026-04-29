import axios from "axios";
import { ApiUrl, getAuthHeaders } from "../../../../Services/config";
import type {
    Permission,
    UserPermission,
    UserPermissionRequest,
} from "../../domain/interfaces";

class PermissionService {
    async getAllPermissions(): Promise<Permission[]> {
        const response = await axios.get<Permission[]>(`${ApiUrl}/api/permissions`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }

    async getUserPermissions(userId: number): Promise<UserPermission[]> {
        const response = await axios.get<UserPermission[]>(`${ApiUrl}/api/permissions/users/${userId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }

    async upsertUserPermission(payload: UserPermissionRequest): Promise<UserPermission> {
        const response = await axios.post<UserPermission>(`${ApiUrl}/api/permissions/users`, payload, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }

    async getStudentPermissions(): Promise<Permission[]> {
        const response = await axios.get<Permission[]>(`${ApiUrl}/api/permissions/rolePermission/student`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }

    async getTeacherPermissions(): Promise<Permission[]> {
        const response = await axios.get<Permission[]>(`${ApiUrl}/api/permissions/rolePermission/teacher`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
}
export const permissionService = new PermissionService();
