import { getBackgroundColor, getDepartmentIcon } from "../../Services/CourseService";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

interface DepartmentProps {
    department: string;
    description: string;
    numberOfCourses: number;
}

export default function DepartmentCard({ department, description, numberOfCourses }: DepartmentProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.4)",
            }}
            transition={{ duration: 0.01 }}
            className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
            <div className={`relative w-full h-40 flex items-center justify-center ${getBackgroundColor(department)}`}>
                <motion.div 
                    className="text-6xl"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    {getDepartmentIcon(department)}
                </motion.div>
            </div>

            <div className="flex flex-col p-6 flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                    {department}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-700">
                        <BookOpen className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{numberOfCourses} Courses</span>
                    </div>

                    <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center text-blue-600 text-sm font-semibold"
                    >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}