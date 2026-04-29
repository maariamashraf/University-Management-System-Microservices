import { User, Mail, Phone, BadgeCheck, Building2, GraduationCap, Clock, Globe, FlaskConical } from "lucide-react";
import SettingsInput from "../shared/SettingsInput";
import SettingsSelect from "../shared/SettingsSelect";
import type { TeacherProfileForm } from "../../../Interfaces/settings";

interface TeacherProfileTabProps {
    form: TeacherProfileForm;
    setForm: (form: TeacherProfileForm) => void;
}

const DEPARTMENTS = ["Computer Science", "Mathematics", "Physics", "Engineering", "Business"];
const TITLES = ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"];

export default function TeacherProfileTab({ form, setForm }: TeacherProfileTabProps) {
    const update = (key: keyof TeacherProfileForm) => (val: string) =>
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
                    label="Email"
                    icon={<Mail size={14} />}
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                />
                <SettingsInput
                    label="Phone"
                    icon={<Phone size={14} />}
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+20 100 000 0000"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <SettingsInput
                    label="Faculty ID"
                    icon={<BadgeCheck size={14} />}
                    value={form.facultyId}
                    disabled
                />
                <SettingsSelect
                    label="Department"
                    icon={<Building2 size={14} />}
                    value={form.department}
                    onChange={update("department")}
                    options={DEPARTMENTS}
                />
                <SettingsSelect
                    label="Academic Title"
                    icon={<GraduationCap size={14} />}
                    value={form.title}
                    onChange={update("title")}
                    options={TITLES}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SettingsInput
                    label="Office Location"
                    icon={<Building2 size={14} />}
                    value={form.office}
                    onChange={update("office")}
                    placeholder="Building & Room"
                />
                <SettingsInput
                    label="Office Hours"
                    icon={<Clock size={14} />}
                    value={form.officeHours}
                    onChange={update("officeHours")}
                    placeholder="e.g. Sun-Tue 10-12"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SettingsInput
                    label="Personal Website"
                    icon={<Globe size={14} />}
                    value={form.website}
                    onChange={update("website")}
                    placeholder="https://..."
                />
                <SettingsInput
                    label="Research Area"
                    icon={<FlaskConical size={14} />}
                    value={form.researchArea}
                    onChange={update("researchArea")}
                    placeholder="Your research focus"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Academic Bio
                </label>
                <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Your academic background and research interests..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                />
            </div>
        </div>
    );
}
