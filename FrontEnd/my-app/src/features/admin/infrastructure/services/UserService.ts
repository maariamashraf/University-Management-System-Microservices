import axios from "axios";
import { ApiUrl, getAuthHeaders } from "../../../../Services/config";
import type { User } from "../../domain/interfaces";

class UserService {
    async getAllUsers(): Promise<User[]> {
        const response = await axios.get<User[]>(`${ApiUrl}/api/users`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
}

export const userService = new UserService();
