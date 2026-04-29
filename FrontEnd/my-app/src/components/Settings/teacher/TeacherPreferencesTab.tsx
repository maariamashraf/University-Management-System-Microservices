import { BarChart2, Globe, Clock } from "lucide-react";
import SettingsSelect from "../shared/SettingsSelect";
import type { TeacherPreferences } from "../../../Interfaces/settings";

interface TeacherPreferencesTabProps {
    preferences: TeacherPreferences;
    setPreferences: (p: TeacherPreferences) => void;
}

const GRADING_SCALES = ["Standard (A-F)", "Percentage (0-100)", "Pass/Fail", "GPA (0.0-4.0)"];
const LANGUAGES = ["English", "Arabic", "French"];
const TIMEZONES = [
    "Africa/Cairo (GMT+2)",
    "UTC (GMT+0)",
    "America/New_York (GMT-5)",
    "Europe/London (GMT+1)",
];

export default function TeacherPreferencesTab({ preferences, setPreferences }: TeacherPreferencesTabProps) {
    const update = (key: keyof TeacherPreferences) => (val: string) =>
        setPreferences({ ...preferences, [key]: val });

    return (
        <div className="flex flex-col gap-5 max-w-md">
            <p className="text-sm text-gray-400">Customize your teaching and grading preferences</p>

            <SettingsSelect
                label="Default Grading Scale"
                icon={<BarChart2 size={14} />}
                value={preferences.gradingScale}
                onChange={update("gradingScale")}
                options={GRADING_SCALES}
            />
            <SettingsSelect
                label="Portal Language"
                icon={<Globe size={14} />}
                value={preferences.defaultLang}
                onChange={update("defaultLang")}
                options={LANGUAGES}
            />
            <SettingsSelect
                label="Timezone"
                icon={<Clock size={14} />}
                value={preferences.timezone}
                onChange={update("timezone")}
                options={TIMEZONES}
            />

            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                <p className="text-sm font-semibold text-blue-600">📋 Grade Submission Deadline</p>
                <p className="text-xs text-gray-500 mt-1">
                    Grades for Spring 2026 must be submitted by{" "}
                    <strong>Jun 8, 2026</strong>
                </p>
            </div>
        </div>
    );
}
