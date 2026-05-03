import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../Services/authService";
import { getUserDashboardData } from "../../Services/userService";
import type { AdminUser } from "../../Interfaces/Auth";
import type { Student } from "../../Interfaces/student";
import type { Teacher } from "../../Interfaces/teacher";
import NotificationBell from "./NotificationBell";

export default function DashboardHeader() {
    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getUserDashboardData(getToken() ?? ""),
        enabled:  !!getToken(),
    });
    const displayName = user?.role === "teacher"
        ? (user as Teacher).name
        : user?.role === "admin"
            ? (user as AdminUser).username
            : (user as Student)?.username ?? "";
    const role = user?.role;

    const initial = displayName ? displayName.charAt(0).toUpperCase() : "";
    

    return (
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
                <h1 className="text-xl font-bold text-gray-800 italic">
                    Welcome back, {displayName}!
                </h1>
                <p className="text-md text-blue-500 mt-0.5 italic">
                    {user?.role === "teacher"
                        ? "Have a great day teaching"
                        : user?.role === "admin"
                            ? "Have a productive day managing the system"
                            : "Have a great day learning"}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56 transition"
                    />
                </div>

                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                    <NotificationBell />
                </button>

                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm select-none">
                        {initial}
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-md font-semibold text-gray-800">{displayName}</p>
                        <p className="text-s text-gray-500">{role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
