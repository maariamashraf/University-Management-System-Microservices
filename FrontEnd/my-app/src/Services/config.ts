import { getToken } from "./authService";

export const ApiUrl: string = "http://localhost:8080";
export const Token: string  = "authToken";
export const UserPermissionsStorageKey: string = "userPermissions";

export const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    return headers;
}

export const getAuthHeaders = () => {
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}