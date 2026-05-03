import axios from "axios";
import { hasPermission } from "./authService";
import { toast } from "sonner";

type PermissionRule = {
    method: string;
    pattern: RegExp;
    permission: string;
};

const permissionRules: PermissionRule[] = [
    { method: "post", pattern: /\/api\/courses$/, permission: "create_course" },
    { method: "put", pattern: /\/api\/courses\/\d+$/, permission: "update_course" },
    { method: "delete", pattern: /\/api\/courses\/\d+$/, permission: "delete_course" },
    { method: "post", pattern: /\/api\/enrolled-courses$/, permission: "course_register" },
    { method: "delete", pattern: /\/api\/enrolled-courses\/teacher\/\d+$/, permission: "unenroll_student" },
    { method: "delete", pattern: /\/api\/enrolled-courses\/student\/\d+$/, permission: "unenroll_course" },
    { method: "post", pattern: /\/api\/messages$/, permission: "send_message" },
    { method: "delete", pattern: /\/api\/messages\/\d+$/, permission: "send_message" },
];

let interceptorAttached = false;

const getPath = (url?: string) => {
    if (!url) return "";
    try {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return new URL(url).pathname;
        }
        return url;
    } catch {
        return url;
    }
};

export const setupPermissionGuardInterceptor = () => {
    if (interceptorAttached) return;

    axios.interceptors.request.use(
        (config) => {
            const path = getPath(config.url);
            const method = (config.method || "get").toLowerCase();

            const matchedRule = permissionRules.find(
                (rule) => rule.method === method && rule.pattern.test(path),
            );

            if (matchedRule && !hasPermission(matchedRule.permission)) {
                toast.error("Access Denied: You do not have permission to perform this action.");
                return Promise.reject(new Error("Access denied"));
            }

            return config;
        },
        (error) => Promise.reject(error),
    );

    interceptorAttached = true; 
};
