export type UserTypeFilter = "all" | "students" | "teachers";

export interface Permission {
    id: number;
    name: string;
    description?: string;
}

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    active: boolean;
    roles: Role[];
    /** Rows from `user_permissions` when returned from GET /api/users (optional on older payloads). */
    userPermissions?: UserPermission[];
}

export interface UserPermission {
    userId: number;
    permissionId: number;
    permissionName: string;
    granted: boolean;
}

export interface UserPermissionRequest {
    userId: number;
    permissionId: number;
    granted: boolean;
}
