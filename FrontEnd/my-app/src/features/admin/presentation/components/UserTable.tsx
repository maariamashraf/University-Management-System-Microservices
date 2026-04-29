import type { User } from "../../domain/interfaces";

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
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-800">{user.username}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
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
