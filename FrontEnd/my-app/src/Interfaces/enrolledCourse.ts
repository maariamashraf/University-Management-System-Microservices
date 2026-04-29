export interface EnrolledCourseResponse {
    id: number;
    studentId: number;
    studentName: string;
    courseId: number;
    courseCode: string;
    courseName: string;
    teacherName: string;
    credits: number;
    startDate: string;
    endDate: string;
    enrollmentDate: string;
}
export interface EnrolledCourseRequest{
    studentId: number;
    courseId: number;
}