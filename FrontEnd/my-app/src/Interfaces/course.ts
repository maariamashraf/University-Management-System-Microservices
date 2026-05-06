import type { EnrolledCourseResponse } from "./enrolledCourse";

export interface course{
    id:number;
    name:string;
    description:string;
    department:string;
    courseCode:string;
    startDate:Date;
    endDate:Date;
    teacherName:string;
    credits:number;
    maxStudents:number;
    enrolledStudents:number;
    enrolledCount?: number;
    teacherUserName?: string;
    creditHours?: number;
}

export interface CourseRequest{
    name:string;
    description:string;
    courseCode:string;
    startDate:string;
    endDate:string;
    departmentName:string;
    userId:number;
    creditHours:number;
    maxStudents:number;
}

export interface CourseSidebar {
courseCode:string;
creditHours:number;
credits?: number;
startDate:Date;
endDate:Date;
enrolledStudents:number;
name:string;
teacherUserName:string;
teacherName?: string;
}