import { Outlet } from "react-router-dom";
import AsideNav from "../components/common/AsideNav";
import DashboardHeader from "../components/common/DashboardHeader";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <AsideNav />
            <div className="flex flex-col flex-1 overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
