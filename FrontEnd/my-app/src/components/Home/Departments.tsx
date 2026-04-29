import { motion } from "framer-motion";
import { useGetDepartments } from "../../CustomeHooks/Departments/UseGetDepartments";
import DepartmentCard from "./DepartmentCard";
import type { department } from "../../Interfaces/department";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

export default function Departments() {
    const { data: departments, error } = useGetDepartments() as { data: department[], error: Error | null };
    return (
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 min-h-[calc(100vh-5rem)] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full overflow-hidden">
                <motion.div 
                    className="flex flex-col items-center justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <motion.div 
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Our <span className="text-blue-600">Departments</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover our diverse range of departments and explore the courses that will shape your future
                        </p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full"
                        variants={containerVariants}
                    >
                        {departments?.map((department: department) => (
                            <motion.div key={department.id} variants={itemVariants}>
                                <DepartmentCard 
                                    department={department.name} 
                                    description={ ""} 
                                    numberOfCourses={ department.numberOfCourses }
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}