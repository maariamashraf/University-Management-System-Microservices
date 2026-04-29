import { FileText, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function FinalSecion() {
    return (
        <section className="w-full bg-[#1e3a8a] py-20 min-h-[calc(100vh-50rem)] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8  overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Ready to take the next step?
                    </h1>
                    <p className="text-white text-lg mb-4">
                        Join our community and meet our students and faculty.
                        Explore our programs and find the one that's right for you.
                    </p>
                    <p className="text-white text-lg mb-4">
                        Be ready for the future with us.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6 py-4">
                    <motion.button whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }} 
                    transition={{ duration: 0.1 }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                        <Link to="/auth/register">
                        Sign Up
                        </Link>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }} className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-3 rounded-md font-semibold transition-colors">
                        Learn More
                    </motion.button>
                    </div>
                    <div className="flex items-stretch justify-center gap-6 mt-12 py-4 w-full max-w-5xl">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 opacity-80 bg-blue-700 bg-opacity-30 backdrop-blur-md rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[240px]"
                        >
                            <FileText className="w-16 h-16 text-amber-500 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">Online Application</h3>
                            <p className="text-white text-sm opacity-90">Fast and easy application process</p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 opacity-80 bg-blue-700 bg-opacity-30 backdrop-blur-sm rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[240px]"
                        >
                            <DollarSign className="w-16 h-16 text-amber-500 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">Scholarships Available</h3>
                            <p className="text-white text-sm opacity-90">Financial aid for qualified students</p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 opacity-80 bg-blue-700 bg-opacity-30 backdrop-blur-sm rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[240px]"
                        >
                            <Calendar className="w-16 h-16 text-amber-500 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">Multiple Intakes</h3>
                            <p className="text-white text-sm opacity-90">Fall, Spring, and Summer admissions</p>
                        </motion.div>
                    </div>
                </div>

                </div>
            </div>
        </section>
    )
}