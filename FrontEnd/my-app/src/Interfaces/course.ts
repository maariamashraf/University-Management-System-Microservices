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
}

export interface CourseRequest{
    name:string;
    description:string;
    courseCode:string;
    startDate:Date;
    endDate:Date;
    departmentName:string;
    teacherUserName:string;
    creditHours:number;
    maxStudents:number;
}

export interface CourseSidebar {
courseCode:string;
creditHours:number;
startDate:Date;
endDate:Date;
enrolledStudents:number;
name:string;
teacherUserName:string;
}