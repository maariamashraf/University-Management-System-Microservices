import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FilterBar from "../components/FilterBar";
import UserTable from "../components/UserTable";
import PermissionModal from "../components/PermissionModal";
import type { User, UserPermission, UserPermissionRequest, UserTypeFilter } from "../../domain/interfaces";
import { userService } from "../../infrastructure/services/UserService";
import { permissionService } from "../../infrastructure/services/PermissionService";
import { getRole } from "../../../../Services/userService";
function hasRole(user: User, targetRole: "STUDENT" | "TEACHER"): boolean {
    return user.roles.some((role) => role.name.toUpperCase().includes(targetRole));
}

function isAdmin(user: User): boolean {
    return user.roles.some((role) => role.name.toUpperCase().includes("ADMIN"));
}

export default function AdminUserPermissionDashboard() {
    const queryClient = useQueryClient();
    const [selectedFilter, setSelectedFilter] = useState<UserTypeFilter>("all");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [optimisticUserPermissions, setOptimisticUserPermissions] = useState<UserPermission[] | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const role = getRole();
   
    const usersQuery = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => userService.getAllUsers(),
    });

    const permissionsQuery = useQuery({
        queryKey: ["all-permissions"],
        queryFn: () => permissionService.getAllPermissions(),
    });

    // Determine selected user's role to pick the right permissions endpoint
    const selectedUserRole = selectedUser
        ? hasRole(selectedUser, "STUDENT") ? "student" : hasRole(selectedUser, "TEACHER") ? "teacher" : null
        : null;

    // Fetch only the permissions that belong to the selected user's role
    const rolePermissionsQuery = useQuery({
        queryKey: ["role-permissions", selectedUserRole],
        queryFn: () =>
            selectedUserRole === "student"
                ? permissionService.getStudentPermissions()
                : permissionService.getTeacherPermissions(),
        enabled: Boolean(selectedUser) && selectedUserRole !== null,
    });

    const userPermissionsQuery = useQuery({
        queryKey: ["user-permissions", selectedUser?.id],
        queryFn: () => permissionService.getUserPermissions(selectedUser!.id),
        enabled: Boolean(selectedUser),
        initialData: selectedUser?.userPermissions,
    });

    const updatePermissionMutation = useMutation({
        mutationFn: (payload: UserPermissionRequest) => permissionService.upsertUserPermission(payload),
        onSuccess: (_, variables) => {
            const action = variables.granted ? "granted" : "revoked";
            setSuccessMessage(`Permission ${action} successfully.`);
        },
        onSettled: async () => {
            if (selectedUser) {
                await queryClient.invalidateQueries({ queryKey: ["user-permissions", selectedUser.id] });
                await queryClient.invalidateQueries({ queryKey: ["role-permissions", selectedUserRole] });
                await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            }
            setTimeout(() => setSuccessMessage(null), 2000);
        },
    });

    const filteredUsers = useMemo(() => {
        // Exclude any user who has an Admin role, even if they also have Student/Teacher
        const nonAdminUsers = (usersQuery.data ?? []).filter(
            (user) => !isAdmin(user) && (hasRole(user, "STUDENT") || hasRole(user, "TEACHER"))
        );
        if (selectedFilter === "students") return nonAdminUsers.filter((user) => hasRole(user, "STUDENT"));
        if (selectedFilter === "teachers") return nonAdminUsers.filter((user) => hasRole(user, "TEACHER"));
        return nonAdminUsers;
    }, [selectedFilter, usersQuery.data]);

    // Convert role permissions to Permission[] for the modal's display list (only role-specific ones)
    const roleDisplayPermissions = useMemo(() => {
        return (rolePermissionsQuery.data ?? []).map((p) => ({
            ...p,
            id: Number(p.id),
        }));
    }, [rolePermissionsQuery.data]);

    // Merge role defaults (granted: true) with explicit user overrides.
    // User overrides always win over role defaults.
    const effectiveUserPermissions = useMemo((): UserPermission[] => {
        const base = optimisticUserPermissions ?? userPermissionsQuery.data ?? [];
        const roleDefaults: UserPermission[] = (rolePermissionsQuery.data ?? []).map((p) => ({
            userId: selectedUser?.id ?? 0,
            permissionId: Number(p.id),
            permissionName: p.name,
            granted: true, // role default = always granted
        }));
        // Overlay: explicit override replaces the role default for that permissionId
        const overrideIds = new Set(base.map((p) => Number(p.permissionId)));
        return [
            ...roleDefaults.filter((p) => !overrideIds.has(Number(p.permissionId))),
            ...base,
        ];
    }, [optimisticUserPermissions, userPermissionsQuery.data, rolePermissionsQuery.data, selectedUser?.id]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setOptimisticUserPermissions(null);
        setSuccessMessage(null);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setOptimisticUserPermissions(null);
        setSuccessMessage(null);
    };

    const handleTogglePermission = (permissionId: number, nextGranted: boolean) => {
        if (!selectedUser) return;

        const basePermissions = optimisticUserPermissions ?? userPermissionsQuery.data ?? [];
        const existing = basePermissions.find((permission) => permission.permissionId === permissionId);

        const nextPermissions = existing
            ? basePermissions.map((permission) =>
                  permission.permissionId === permissionId ? { ...permission, granted: nextGranted } : permission
              )
            : [
                  ...basePermissions,
                  {
                      userId: selectedUser.id,
                      permissionId,
                      permissionName:
                          roleDisplayPermissions.find((p) => p.id === permissionId)?.name ??
                          `Permission ${permissionId}`,
                      granted: nextGranted,
                  },
              ];

        setOptimisticUserPermissions(nextPermissions);

        updatePermissionMutation.mutate(
            {
                userId: selectedUser.id,
                permissionId,
                granted: nextGranted,
            },
            {
                onError: () => {
                    setOptimisticUserPermissions(userPermissionsQuery.data ?? []);
                },
            }
        );
    };
    if(role !== "admin") {
        return (
            <div className="min-h-full flex items-center justify-center bg-slate-100 p-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    You do not have permission to access this page.
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-full bg-slate-100 p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-sm text-slate-600">
                        Manage users and inspect or modify their permissions from a single workspace.
                    </p>
                </header>

                <FilterBar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

                {usersQuery.isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                        Loading users...
                    </div>
                ) : usersQuery.isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Failed to load users. Please refresh and try again.
                    </div>
                ) : (
                    <UserTable users={filteredUsers} onSelectUser={handleSelectUser} />
                )}

                {selectedUser && (
                    <PermissionModal
                        user={selectedUser}
                        permissions={roleDisplayPermissions}
                        userPermissions={effectiveUserPermissions}
                        isLoading={rolePermissionsQuery.isLoading || userPermissionsQuery.isLoading}
                        isSaving={updatePermissionMutation.isPending}
                        errorMessage={
                            rolePermissionsQuery.isError || userPermissionsQuery.isError || updatePermissionMutation.isError
                                ? "Unable to update permissions right now."
                                : null
                        }
                        successMessage={successMessage}
                        onTogglePermission={handleTogglePermission}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </section>
    );
}
