import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../ContextsProviders/AuthContext";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../Services/config";

type Role = "student" | "teacher";

export default function RegisterFrom() {
    const { register, isError } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<Role>("student");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleGitHubLogin = () => {
        window.location.href = `${ApiUrl}/oauth2/authorization/github`;
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        const username = form.username.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const teacherCode = role === "teacher" ? form.teacherCode.value : undefined;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            console.log("Registering with:", { email, username, password, role, teacherCode });
            await register(email, password, username, teacherCode);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md px-4 sm:px-8 py-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center flex flex-col items-center justify-center space-y-6 transform transition-all hover:scale-[1.02]">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                        <svg className="w-10 h-10 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Registered!</h2>
                        <p className="text-gray-600 text-base px-2">Your account has been created successfully. You can now log in with your credentials.</p>
                    </div>
                    <Link
                        to="/auth/login"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        Go to Login Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md px-4 sm:px-8 py-4">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    Welcome to the system
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    Please enter your credentials to register
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 sm:p-5 rounded-lg">

                {/* Role toggle */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Register as
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setRole("student")}
                            className={`py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                                role === "student"
                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                            }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("teacher")}
                            className={`py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                                role === "teacher"
                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                            }`}
                        >
                            Teacher
                        </button>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 text-sm"
                    />
                </div>

                {/* Username */}
                <div className="space-y-1">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                        User Name
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 text-sm"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 pr-28 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {showPassword ? "Hide" : "Show"} Password
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 pr-28 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {showConfirmPassword ? "Hide" : "Show"} Password
                        </button>
                    </div>
                </div>

                {/* Teacher Code — only visible when role is teacher */}
                {role === "teacher" && (
                    <div className="space-y-1">
                        <label htmlFor="teacherCode" className="block text-sm font-semibold text-gray-700">
                            Teacher Code
                        </label>
                        <input
                            type="text"
                            id="teacherCode"
                            name="teacherCode"
                            placeholder="Enter your teacher code"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-blue-400 text-sm bg-blue-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The teacher code is provided by the university administration.
                        </p>
                    </div>
                )}

                {/* Remember me */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        Remember me
                    </label>
                </div>

                {isError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        {isError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] text-sm disabled:opacity-60"
                >
                    {loading ? "Registering..." : role === "teacher" ? "Register as Teacher" : "Register as Student"}
                </button>

                <div className="text-center flex items-center justify-center gap-1">
                    <p className="text-sm text-gray-600">Already have an account?</p>
                    <Link
                        to="/auth/login"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm"
                    >
                        Sign In
                    </Link>
                </div>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-100 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleGitHubLogin}
                        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 font-medium text-gray-700 hover:shadow-md text-sm"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Continue with GitHub
                    </button>
                    <p className="text-xs text-center text-gray-400">
                        GitHub sign-up creates a student account by default
                    </p>
                </div>
            </form>
        </div>
    );
}
