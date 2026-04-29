import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../ContextsProviders/AuthContext";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../Services/config";
import { getPostLoginRedirectPath, getToken } from "../../Services/authService";

export default function LoginForm() {

    const { login, isError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleGitHubLogin = () => {
        window.location.href = `${ApiUrl}/oauth2/authorization/github`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        try {
            console.log(email, password);
            await login(email, password);
            navigate(getPostLoginRedirectPath(getToken()), { replace: true });
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Please enter your credentials to login</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-gray-100 p-4 rounded-lg">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 pr-12"
                        />
                    
                    </div>
                </div>

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
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                <div className="text-center mt-6 flex items-center justify-center gap-2">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                    </p>
                    <Link to="/auth/register"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleGitHubLogin}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 font-medium text-gray-700 hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Continue with GitHub
                    </button>
                </div>
            </form>
        </div>
    )
}