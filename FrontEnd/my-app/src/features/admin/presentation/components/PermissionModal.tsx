import type { Permission, User, UserPermission } from "../../domain/interfaces";

interface PermissionModalProps {
    user: User;
    permissions: Permission[];
    userPermissions: UserPermission[];
    isLoading: boolean;
    isSaving: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    onTogglePermission: (permissionId: number, nextGranted: boolean) => void;
    onClose: () => void;
}

/**
 * Looks up the granted status from userPermissions (which already contains merged role defaults + overrides).
 * Uses Number() to safely compare permissionId regardless of string/number type from the API.
 */
function isEffectivePermissionGranted(userPermissions: UserPermission[], permissionId: number): boolean {
    const match = userPermissions.find((p) => Number(p.permissionId) === Number(permissionId));
    return match?.granted ?? false;
}

export default function PermissionModal({
    user,
    permissions,
    userPermissions,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    onTogglePermission,
    onClose,
}: PermissionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Permission Management</h2>
                        <p className="text-sm text-slate-500">
                            {user.username} ({user.email})
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto px-6 py-4">
                    {errorMessage && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    )}
                    {successMessage && (
                        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            {successMessage}
                        </p>
                    )}

                    {isLoading ? (
                        <div className="py-10 text-center text-slate-500">Loading assigned permissions...</div>
                    ) : (
                        <ul className="space-y-3">
                            {permissions.map((permission) => {
                                const granted = isEffectivePermissionGranted(userPermissions, permission.id);

                                return (
                                    <li
                                        key={permission.id}
                                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{permission.name}</p>
                                            {permission.description && (
                                                <p className="text-xs text-slate-500">{permission.description}</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => onTogglePermission(permission.id, !granted)}
                                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                                granted
                                                    ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                                    : "border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                            } ${isSaving ? "cursor-not-allowed opacity-60" : ""}`}
                                        >
                                            {granted ? "Revoke" : "Grant"}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
