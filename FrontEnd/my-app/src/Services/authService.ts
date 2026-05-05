import { ApiUrl, Token, UserPermissionsStorageKey, getHeaders } from "./config";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import type { QueryClient } from "@tanstack/react-query";
import type {
  RegisterRequest,
  AuthRequest,
  MyTokenPayload,
  AuthUser,
} from "../Interfaces/Auth";

export function isAuth() {
  const token = getToken();
  if (!token) return false;
  return true;
}
export function getUserId(): number {
  const token = getToken();
  if (!token){
    console.error("No token found when trying to get user ID");
    throw new Error("No token found");
  }
  return jwtDecode<MyTokenPayload>(token).userId;
}

export function getUserName(): string {
  const token = getToken();
  if (!token){
    console.error("No token found when trying to get user name");
    throw new Error("No token found");
  }
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.userName ?? decoded.sub;
}

export function getTokenRoles(token: string): string[] {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    const roles = decoded.roles;
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  } catch {
    return [];
  }
}

function normalizeRole(role?: string): string {
  if (!role || typeof role !== 'string') {
    return "";
  }
  return role.replace(/^ROLE_/, "").toLowerCase();
}
export function setToken(token: string) {
  localStorage.setItem(Token, token);
}
export function getToken() {
  return localStorage.getItem(Token);
}
export function setUserCache(queryClient: QueryClient, user: AuthUser) {
  queryClient.setQueryData(["user"], user);
}
export function removeUserCache(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: ["user"] });
}
export function removeToken() {
  if (getToken()) {
    localStorage.removeItem(Token);
  }
}

export function setUserPermissions(permissions: string[]) {
  localStorage.setItem(UserPermissionsStorageKey, JSON.stringify(permissions));
}

export function IsAdmin(): boolean {
  const token = getToken();
  if (!token) return false;
  return getTokenRoles(token).some((role) =>
    normalizeRole(role).includes("admin"),
  );
}

export function getUserPermissions(): string[] {
  const rawPermissions = localStorage.getItem(UserPermissionsStorageKey);
  if (!rawPermissions) return [];
  try {
    const parsed = JSON.parse(rawPermissions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function removeUserPermissions() {
  localStorage.removeItem(UserPermissionsStorageKey);
}

export function hasPermission(permission: string): boolean {
  return getUserPermissions().includes(permission);
}

export function assertPermission(permission: string) {
  if (!hasPermission(permission)) {
    throw new Error("Access denied");
  }
}

export function getTokenFromAuthResponse(data: any): string {
  return data?.token || data?.Token || data;
}

export function getPermissionsFromAuthResponse(data: any): string[] {
  const permissions = data?.userPermissions || data?.UserPermissions || [];
  return Array.isArray(permissions) ? permissions : [];
}

export async function HandleRegister(
  email: string,
  password: string,
  username: string,
  teacherCode?: string,
) {
  const request: RegisterRequest = {
    email,
    password,
    username,
    teacherCode: teacherCode ?? undefined,
  };
  console.log("request", request);

  try {
    const response = await axios.post(`${ApiUrl}/api/auth/register`, request, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("error.response", error.response.data);
        throw new Error(error.response.data.message || "Registration failed");
      }
      if (error.request) {
        console.log("error.request", error.request);
        throw new Error("No response from server");
      }
    }
    throw new Error("Registration failed. Please try again.");
  }
}

export async function HandleLogin(email: string, password: string) {
  const request: AuthRequest = {
    email,
    password,
  };
  try {
    const response = await axios.post(`${ApiUrl}/api/auth/login`, request, {
      headers: getHeaders(),
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("error.response", error.response.data);
        throw new Error(error.response.data.message || "Login failed");
      }
      if (error.request) {
        console.log("error.request", error.request);
        throw new Error("No response from server");
      }
    }
    throw new Error("Login failed. Please try again.");
  }
}

export async function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token) as MyTokenPayload;
    const roles = decoded.roles;
    decoded.roles = Array.isArray(roles) ? roles : roles ? [roles] : [];
    return decoded;
  } catch {
    return { roles: [], userId: 0, sub: "", iat: 0, exp: 0 } as MyTokenPayload;
  }
}

export function getPostLoginRedirectPath(token?: string | null): string {
  if (!token) return "/dashboard";

  try {
    if (getTokenRoles(token).some((role) => normalizeRole(role) === "admin")) {
      return "/dashboard/admin/users-permissions";
    }
  } catch {
    return "/dashboard";
  }

  return "/dashboard";
}
