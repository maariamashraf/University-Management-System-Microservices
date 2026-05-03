import type { User } from "../../domain/interfaces";
import { deactivateUser } from "../../../../Services/userService";
import { activateUser } from "../../../../Services/userService";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../../main";
import { toast } from "sonner";

interface UserTableProps {
    users: User[];
    onSelectUser: (user: User) => void;
}
function toDisplayRoleName(name: string): string {
    if (name.toUpperCase().includes("STUDENT")) return "Student";
    if (name.toUpperCase().includes("TEACHER")) return "Teacher";
    return name;
}
export default function UserTable({ users, onSelectUser }: UserTableProps) {
    const { mutate: deactivateUserMutation } = useMutation({
        mutationFn: (userId: number) => deactivateUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError:(error) => {
            toast.error(error.message);
        },
    });
    const { mutate: activateUserMutation } = useMutation({
        mutationFn: (userId: number) => activateUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError:(error) => {
            toast.error(error.message);
        },
    });
    if (users.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                No users found for this filter.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Username
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                        </th>

                    <th>
                        change Acount status
                    </th>
                        
                        <th className="mr-6 px-15 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Action
                        </th>


                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-800">{user.username}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                            <td className={`px-4 py-3 text-sm font-medium ${user.roles.some((role) => toDisplayRoleName(role.name) === 'Student') ? "text-gray-500" : "text-green-500"}`} >
                                {user.roles.map((role) => toDisplayRoleName(role.name)).join(", ")}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                        user.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {user.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>
                                {
                                    user.active ? (
                                        <button className="bg-red-400 text-white ml-16 px-2 py-2 rounded-lg cursor-pointer" onClick={() => deactivateUserMutation(user.id)}>
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button className="bg-green-500 text-white ml-16 px-2 py-2 rounded-lg" onClick={() => activateUserMutation(user.id)}>
                                            Activate
                                        </button>
                                    )
                                }
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    onClick={() => onSelectUser(user)}
                                    className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                >
                                    Manage Permissions
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
