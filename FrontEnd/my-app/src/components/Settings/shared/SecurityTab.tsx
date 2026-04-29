import { Key, Lock, ShieldCheck } from "lucide-react";
import SettingsInput from "./SettingsInput";
import type { ActiveSession } from "../../../Interfaces/settings";

interface SecurityTabProps {
    passwordStatus: string;
    sessions: ActiveSession[];
}

function ActiveSessionItem({ session }: { session: ActiveSession }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
                <p className="text-sm text-gray-700">{session.device}</p>
                <p className="text-xs text-gray-400">{session.time}</p>
            </div>
            {session.isCurrent ? (
                <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold">
                    Current
                </span>
            ) : (
                <button className="text-xs text-red-500 border border-red-400 px-3 py-1 rounded-full font-semibold hover:bg-red-50 transition">
                    Revoke
                </button>
            )}
        </div>
    );
}

export default function SecurityTab({ passwordStatus, sessions }: SecurityTabProps) {
    return (
        <div className="flex flex-col gap-5 max-w-md">
            <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                <p className="text-sm font-semibold text-green-700">✅ {passwordStatus}</p>
            </div>

            <SettingsInput
                label="Current Password"
                icon={<Key size={14} />}
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Enter current password"
            />
            <SettingsInput
                label="New Password"
                icon={<Lock size={14} />}
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Min. 8 characters"
            />
            <SettingsInput
                label="Confirm New Password"
                icon={<Lock size={14} />}
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Repeat new password"
            />

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400 mt-0.5">Extra layer of security for your account</p>
                </div>
                <button className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition">
                    Enable
                </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <ShieldCheck size={15} /> Active Sessions
                </p>
                {sessions.map(s => (
                    <ActiveSessionItem key={s.device} session={s} />
                ))}
            </div>
        </div>
    );
}
