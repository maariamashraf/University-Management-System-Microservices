import { getAuthHeaders } from "./config";
import axios from "axios";
import { getUserId } from "./authService";
import { ApiUrl } from "./config";
import type { NotificationUserRequest, NotificationCourseRequest } from "../Interfaces/Notification";

export async function getNotifications() {
    const userId = getUserId();
    try{
        const response = await axios.get(`${ApiUrl}/api/notifications/user/${userId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
    if(axios.isAxiosError(error)){
        if(error.response){
            throw new Error(error.response.data.message);
        }
        if(error.request){
            throw new Error("No response from server");
        }
        throw new Error("An error occurred while getting notifications");
    }
    }
}
export async function markNotificationAsRead(notificationId: number) {
    try{
        const response = await axios.patch(`${ApiUrl}/api/notifications/${notificationId}/read`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("An error occurred while marking notification as read");
    }
}
export async function markAllNotificationsAsRead() {
    const userId = getUserId();
    try{
        const response = await axios.patch(`${ApiUrl}/api/notifications/user/${userId}/read-all`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("An error occurred while marking all notifications as read");
    }
}
 export async function getUnreadNotificationsCount() {
    try{
        const userId = getUserId();
        const response = await axios.get(`${ApiUrl}/api/notifications/user/${userId}/unread/count`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("An error occurred while getting unread notifications count");
    }
}

export async function createUserNotification(notification: NotificationUserRequest) {
    try{
        const response = await axios.post(`${ApiUrl}/api/notifications/user/send`, notification, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("An error occurred while creating user notification");
    }
}
export async function createCourseNotification(notification: NotificationCourseRequest) {
    try{
        const response = await axios.post(`${ApiUrl}/api/notifications/course`, notification, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response){
                throw new Error(error.response.data.message);
            }
            if(error.request){
                throw new Error("No response from server");
            }
        }
        throw new Error("An error occurred while creating course notification");
    }
}
