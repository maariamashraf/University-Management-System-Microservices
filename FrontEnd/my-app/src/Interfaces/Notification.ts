export type NotificationType =
  | "ENROLLMENT"
  | "ANNOUNCEMENT"
  | "COURSE_UPDATE"
  | "GRADE"
  | "SYSTEM";   

export interface NotificationMessage {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface NotificationCourseRequest {
    courseId: number;
    title: string;
    message: string;
    type: NotificationType;
}
export interface NotificationCourseResponse {
  id:number;
  courseId:number;
  title:string;
  isRead:boolean;
  type:NotificationType;
  message:string;
  createdAt:string;
  updatedAt:string;
}

export interface NotificationUserRequest {
    recipientId: number;
    title: string;
    message: string;
    type: NotificationType;
}
export interface NotificationUserResponse {
    id:number;
    recipientId:number;
    title:string;
    isRead:boolean;
    type:NotificationType;
    message:string;
    createdAt:string;
    updatedAt:string;
}