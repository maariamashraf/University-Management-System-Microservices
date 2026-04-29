 import { getRole } from "../../Services/userService";
import { TeacherCoursesDashboard } from "./TeacherCouresesDashboard";
import { StudentCoursesDashboard } from "./StudentCoursesDashboard";
 
 export function CoursesDashboard() {
        const role = getRole();
        console.log("hello from CourseDashboard : User role:", role);
        
       if (role==="teacher"){
        return <TeacherCoursesDashboard />;
       }
    return <StudentCoursesDashboard />;  
 }