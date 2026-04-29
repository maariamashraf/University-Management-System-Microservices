import { motion } from "framer-motion";

export default function Indicator() {
    return (
        <section className="w-full bg-white py-20  overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4  gap-8 py-10">
                    <motion.div
                        whileHover={{
                            scale: 1.2,
                            boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.1)",
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center justify-center">
                        <div
                            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <p className="text-2xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
                            25,000+
                        </p>
                        <p className="text-xl italic  mb-8 max-w-2xl">
                            Enrolled Students
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            scale: 1.2,
                            boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.1)",
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center justify-center">
                        <div
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <p className="text-2xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
                            50+
                        </p>
                        <p className="text-xl italic  mb-8 max-w-2xl">
                            Accredited Programs
                        </p>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                scale: 1.2,
                                boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center justify-center">
                            <div
                                className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                </svg>
                            </div>
                            <p className="text-2xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
                                100+
                            </p>
                            <p className="text-xl italic  mb-8 max-w-2xl">Academic Staff</p>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                scale: 1.2,
                                boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center justify-center">
                            <div
                                className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-accent"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                            </div>
                            <p className="text-2xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
                                90%
                            </p>
                            <p className="text-xl italic  mb-8 max-w-2xl">Graduation Rate</p>
                        </motion.div>
                    </div>
                </div>
            </section>
            
    )
}