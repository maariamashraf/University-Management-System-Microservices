import { createContext, useContext, useMemo } from "react";
import {
    HandleLogin, HandleRegister, setToken, setUserCache,
    removeToken, removeUserCache, setUserPermissions, removeUserPermissions,
    getPermissionsFromAuthResponse, getTokenFromAuthResponse,
} from "../Services/authService";
import { getUserDashboardData } from "../Services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthContextType } from "../Interfaces/Auth";

// ─── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            HandleLogin(email, password),
        onSuccess: async (data) => {
            const token = getTokenFromAuthResponse(data);
            const permissions = getPermissionsFromAuthResponse(data);
            setToken(token);
            setUserPermissions(permissions);
            const user = await getUserDashboardData(token);
            setUserCache(queryClient, user);
        },
    });

    const registerMutation = useMutation({
        mutationFn: ({
            email, password, username, TeacherCode,
        }: { email: string; password: string; username: string; TeacherCode?: string }) =>
            HandleRegister(email, password, username, TeacherCode),
    });

    const value = useMemo<AuthContextType>(
        () => ({
            login: (email, password) => loginMutation.mutateAsync({ email, password }),
            register: (email, password, username, TeacherCode) =>
                registerMutation.mutateAsync({ email, password, username, TeacherCode }),
            logout: () => {
                removeToken();
                removeUserPermissions();
                removeUserCache(queryClient);
            },
            isError: loginMutation.error?.message || registerMutation.error?.message,
        }),
        [loginMutation, registerMutation, queryClient],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
