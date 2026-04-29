import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NavProps {
    onScrollToCourses?: () => void;
    onScrollToDepartments?: () => void;
    onScrollToFeedBacks?: () => void;
    onScrollToFooter?: () => void;
}

export default function Nav({ onScrollToCourses, onScrollToDepartments, onScrollToFeedBacks, onScrollToFooter }: NavProps) {
    const navLinkClass = "hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none text-gray-600 text-xl font-[inherit] p-0";

    return (
        <header className="w-full  bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full py-6">

                <div className="flex items-center justify-between h-full">

                    {/* 1. Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer">
                        <div className="flex items-center justify-center w-13 h-13 bg-blue-800 text-white text-lg font-bold rounded-full">
                            HU
                        </div>
                        <span className="text-3xl font-bold text-slate-800">
                            Helwan University
                        </span>
                    </div>

                    {/* 2. Navigation Links */}
                    <nav className="hidden lg:block">
                        <ul className="flex items-center gap-7 text-gray-600 text-xl">
                            <li>
                                <Link to="/" className="hover:text-blue-800 transition-colors">Home</Link>
                            </li>
                            <li>
                                <button onClick={onScrollToDepartments} className={navLinkClass}>
                                    Departments
                                </button>
                            </li>
                            <li>
                                <button onClick={onScrollToCourses} className={navLinkClass}>
                                    Courses
                                </button>
                            </li>
                            <li>
                                <button onClick={onScrollToFeedBacks} className={navLinkClass}>
                                    Student Life
                                </button>
                            </li>
                            <li>
                                <button onClick={onScrollToFooter} className={navLinkClass}>
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* 3. CTA Button */}
                    <div className="hidden lg:block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-md font-semibold text-m transition-colors shadow-sm">
                            <Link to="/auth/register">
                                Sign Up
                            </Link>
                        </motion.button>
                    </div>

                </div>
            </div>
        </header>
    );
}