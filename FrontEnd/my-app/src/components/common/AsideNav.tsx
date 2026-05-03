import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    FileText,
    Calendar,
    Settings,
    LogOut,
    GraduationCap,
    ShieldCheck,
    BookAIcon,
    BlindsIcon,
} from "lucide-react";
import { useAuth } from "../../ContextsProviders/AuthContext";
import { motion } from "framer-motion";
import {getRole} from "../../Services/userService";
const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "My Courses", icon: BookOpen, to: "/dashboard/Courses" },
    { label: "Registration", icon: ClipboardList, to: "/dashboard/registration" },
    { label: "Grades & Transcript", icon: FileText, to: "/dashboard/grades" },
    { label: "Schedule", icon: Calendar, to: "/dashboard/schedule" },
    { label: "Settings", icon: Settings, to: "/dashboard/settings" },
];
const AdminNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard/admin/dashboard" },
    { label: "Users", icon: ShieldCheck, to: "/dashboard/admin/users-permissions" },
    { label: "Audit log", icon: BlindsIcon, to: "/dashboard/admin/audit-log" },
    { label: "Courses", icon: BookAIcon, to: "/dashboard/admin/courses" },
];

export default function AsideNav() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const role = getRole();
    const visibleNavItems = role === "admin" ? AdminNavItems : navItems;
    console.log("Role is:", role);
    console.log("Visible nav items:", visibleNavItems);

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <aside className="w-64 min-h-screen bg-[#1e3a6e] text-white flex flex-col shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-400 rounded-lg shrink-0">
                    <GraduationCap size={22} className="text-white" />
                </div>
                <div className="leading-tight">
                    <p className="font-bold text-base tracking-wide">Hu Portal</p>
                    <p className="text-xs text-blue-300">Excellence in Education</p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {visibleNavItems.map(({ label, icon: Icon, to }) => (
                    <motion.div
                    key={to}    
                    whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                    <NavLink
                    
                        to={to}
                        end

                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-white/15 text-white"
                                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </motion.button>
            </div>
        </aside>
    );
}
