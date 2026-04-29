import { Outlet } from "react-router-dom";
export default function Auth() {
    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row">

            {/* Branding panel — full width on mobile, half width on desktop */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center flex-col gap-4 py-10 lg:py-0 lg:min-h-screen"
                style={{ backgroundColor: 'rgb(12, 61, 126)' }}
            >
                <div
                    className="rounded-full p-5 sm:p-6 shadow-lg"
                    style={{ backgroundColor: 'rgb(12, 61, 126)' }}
                >
                    <div className="text-5xl sm:text-6xl font-bold text-white tracking-wide animate-bounce font-sans">
                        HU
                    </div>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide text-center px-4 font-sans">
                    Helwan University System
                </h1>
            </div>

            {/* Form panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center py-8 px-4 lg:px-0 lg:min-h-screen overflow-y-auto">
                <Outlet />
            </div>

        </div>
    );
}