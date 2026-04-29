import SettingsToggle from "../shared/SettingsToggle";
import type { StudentPrivacySettings } from "../../../Interfaces/settings";

interface StudentPrivacyTabProps {
    privacy: StudentPrivacySettings;
    setPrivacy: (p: StudentPrivacySettings) => void;
}

export default function StudentPrivacyTab({ privacy, setPrivacy }: StudentPrivacyTabProps) {
    const update = (key: keyof StudentPrivacySettings) => (val: boolean) =>
        setPrivacy({ ...privacy, [key]: val });

    return (
        <div className="max-w-lg">
            <p className="text-sm text-gray-400 mb-4">
                Control what other students and faculty can see
            </p>
            <SettingsToggle
                label="Public Profile"
                desc="Other students can view your profile page"
                checked={privacy.showProfile}
                onChange={update("showProfile")}
            />
            <SettingsToggle
                label="Show Grades"
                desc="Display your GPA and grade history"
                checked={privacy.showGrades}
                onChange={update("showGrades")}
            />
            <SettingsToggle
                label="Show Schedule"
                desc="Let others see your class schedule"
                checked={privacy.showSchedule}
                onChange={update("showSchedule")}
            />

            <div className="mt-6 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
                <p className="text-sm font-semibold text-orange-600">⚠️ Data & Account</p>
                <p className="text-xs text-gray-500 mt-1.5 mb-3">
                    Permanently delete your account and all associated data
                </p>
                <button className="px-4 py-2 text-xs font-semibold text-red-500 border border-red-400 rounded-lg hover:bg-red-50 transition">
                    Request Account Deletion
                </button>
            </div>
        </div>
    );
}
