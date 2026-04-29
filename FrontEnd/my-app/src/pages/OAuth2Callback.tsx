import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPostLoginRedirectPath, setToken, setUserCache } from "../Services/authService";
import { getUserDashboardData } from "../Services/userService";
import { useQueryClient } from "@tanstack/react-query";

export default function OAuth2Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const token = searchParams.get("token");

        if (!token) {
            navigate("/auth/login", { replace: true });
            return;
        }

        const finishLogin = async () => {
            try {
                setToken(token);
                const user = await getUserDashboardData(token);
                setUserCache(queryClient, user);
                navigate(getPostLoginRedirectPath(token), { replace: true });
            } catch {
                navigate("/auth/login?error=oauth_failed", { replace: true });
            }
        };

        finishLogin();
    }, [searchParams, navigate, queryClient]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-700 font-medium text-lg">Signing you in with GitHub…</p>
                <p className="text-gray-400 text-sm">Please wait a moment</p>
            </div>
        </div>
    );
}
