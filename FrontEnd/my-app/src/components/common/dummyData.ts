export interface Course {
    id: number;
    name: string;
    Teacher: string;
    department: string;
    credits: number;
    maxStudents: number;
    enrolledStudents: number;
    description: string;
    image: string;
}


export interface Department {
    name: string;
    description: string;
    numberOfCourses: number;
    id: number;
}   


