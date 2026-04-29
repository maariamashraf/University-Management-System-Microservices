import { User, Mail, Phone, BadgeCheck, GraduationCap, Calendar } from "lucide-react";
import SettingsInput from "../shared/SettingsInput";
import type { StudentProfileForm } from "../../../Interfaces/settings";

interface StudentProfileTabProps {
    form: StudentProfileForm;
    setForm: (form: StudentProfileForm) => void;
}

export default function StudentProfileTab({ form, setForm }: StudentProfileTabProps) {
    const update = (key: keyof StudentProfileForm) => (val: string) =>
        setForm({ ...form, [key]: val });

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
                <SettingsInput
                    label="First Name"
                    icon={<User size={14} />}
                    value={form.firstName}
                    onChange={update("firstName")}
                    placeholder="First name"
                />
                <SettingsInput
                    label="Last Name"
                    icon={<User size={14} />}
                    value={form.lastName}
                    onChange={update("lastName")}
                    placeholder="Last name"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SettingsInput
                    label="Email Address"
                    icon={<Mail size={14} />}
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="your@email.com"
                />
                <SettingsInput
                    label="Phone Number"
                    icon={<Phone size={14} />}
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+20 100 000 0000"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <SettingsInput
                    label="Student ID"
                    icon={<BadgeCheck size={14} />}
                    value={form.studentId}
                    disabled
                />
                <SettingsInput
                    label="Major"
                    icon={<GraduationCap size={14} />}
                    value={form.major}
                    onChange={update("major")}
                    placeholder="Your major"
                />
                <SettingsInput
                    label="Year / Standing"
                    icon={<Calendar size={14} />}
                    value={form.year}
                    onChange={update("year")}
                    placeholder="e.g. Sophomore"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                />
            </div>
        </div>
    );
}
