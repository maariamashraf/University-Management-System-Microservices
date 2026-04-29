import { motion } from "framer-motion";
import {Link, useNavigate} from "react-router-dom"
import { isAuth } from "../../Services/authService";
export default function Welcome({scrollToSection}: {scrollToSection: () => void}) {
    const navigate = useNavigate();
        const isAuthenticated = isAuth();
        const handleExploreCourses = () => {
            if(isAuthenticated){
                navigate("/dashboard/courses");
            }else{
                navigate("/auth/login");
            }
        }
    return (
        <section className="w-full bg-[#1e3a8a] py-20 min-h-[calc(100vh-5rem)] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full overflow-hidden">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2 },
                    },
                }}
                className="flex flex-col items-center text-center justify-center h-full py-20">
                <motion.h1
                    variants={{
                        hidden: { opacity: 0, x: -200 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", duration: 0.5, stiffness: 50 },
                        },
                    }}
                    className="italic text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Unlock Your Potential at <br /> &ldquo;Helwan University&rdquo;
                </motion.h1>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, x: -200 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", duration: 0.5, stiffness: 50 },
                        },
                    }}
                    className="text-xl italic text-blue-100 mb-8 max-w-2xl">
                    World-class education, diverse community, and a bright future
                    await you. Join thousands of students shaping tomorrow's world.
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { type: "spring", duration: 0.5, stiffness: 50 },
                        },
                    }}
                    className="flex gap-4">
                    <motion.button
                        onClick={handleExploreCourses}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className=" mt-8 cursor-pointer text-2xl bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                        Explore Courses
                    </motion.button>
                    <motion.button
                        onClick={scrollToSection}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className=" mt-8 ml-6 cursor-pointer text-2xl bg-white hover:bg-gray-100 text-blue-900 px-8 py-3 rounded-md font-semibold transition-colors">
                        Learn More
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    </section>
    )
}