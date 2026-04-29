import SettingsToggle from "../shared/SettingsToggle";
import type { TeacherPrivacySettings } from "../../../Interfaces/settings";

interface TeacherPrivacyTabProps {
    privacy: TeacherPrivacySettings;
    setPrivacy: (p: TeacherPrivacySettings) => void;
}

export default function TeacherPrivacyTab({ privacy, setPrivacy }: TeacherPrivacyTabProps) {
    const update = (key: keyof TeacherPrivacySettings) => (val: boolean) =>
        setPrivacy({ ...privacy, [key]: val });

    return (
        <div className="max-w-lg">
            <p className="text-sm text-gray-400 mb-4">
                Control what students and other faculty members can see on your profile
            </p>
            <SettingsToggle
                label="Show Office Hours Publicly"
                desc="Students can view your office hours"
                checked={privacy.showOfficeHours}
                onChange={update("showOfficeHours")}
            />
            <SettingsToggle
                label="Show Email to Students"
                desc="Email address visible in course pages"
                checked={privacy.showEmail}
                onChange={update("showEmail")}
            />
            <SettingsToggle
                label="Show Research Interests"
                desc="Display on your public faculty page"
                checked={privacy.showResearch}
                onChange={update("showResearch")}
            />
            <SettingsToggle
                label="Show Phone Number"
                desc="Phone visible to department heads only"
                checked={privacy.showPhone}
                onChange={update("showPhone")}
            />

            <div className="mt-6 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
                <p className="text-sm font-semibold text-orange-600">⚠️ Account Actions</p>
                <p className="text-xs text-gray-500 mt-1.5 mb-3">
                    Contact HR to request account changes or deactivation
                </p>
                <button className="px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                    Contact HR Department
                </button>
            </div>
        </div>
    );
}
