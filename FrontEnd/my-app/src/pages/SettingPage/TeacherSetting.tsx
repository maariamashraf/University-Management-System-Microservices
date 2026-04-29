import { useGetTeacherSetting } from "../../CustomeHooks/UserHooks/UseGetTeacherSetting";
import { useTeacherSettingsForm } from "../../CustomeHooks/UserHooks/UseTeacherSettingsForm";
import TeacherSettingsHeader from "../../components/Settings/teacher/TeacherSettingsHeader";
import TeacherStatsRow from "../../components/Settings/teacher/TeacherStatsRow";
import TeacherProfileTab from "../../components/Settings/teacher/TeacherProfileTab";
import TeacherCoursesTab from "../../components/Settings/teacher/TeacherCoursesTab";
import TeacherNotificationsTab from "../../components/Settings/teacher/TeacherNotificationsTab";
import TeacherPreferencesTab from "../../components/Settings/teacher/TeacherPreferencesTab";
import TeacherPrivacyTab from "../../components/Settings/teacher/TeacherPrivacyTab";
import SecurityTab from "../../components/Settings/shared/SecurityTab";
import SettingsTabBar from "../../components/Settings/shared/SettingsTabBar";
import LoadingSpinner from "../../components/common/LodingSpinner";
import type { Teacher } from "../../Interfaces/teacher";
import type { ActiveSession } from "../../Interfaces/settings";

const TABS = [
    { key: "profile", label: "Profile" },
    { key: "courses", label: "Courses" },
    { key: "notifications", label: "Notifications" },
    { key: "preferences", label: "Preferences" },
    { key: "privacy", label: "Privacy" },
    { key: "security", label: "Security" },
];

const SESSIONS: ActiveSession[] = [
    { device: "Chrome · Cairo, EG", time: "Now", isCurrent: true },
    { device: "Mobile App · Cairo, EG", time: "2 hours ago", isCurrent: false },
];

export default function TeacherSetting() {
    const { data, isLoading, error } = useGetTeacherSetting();
    const teacher = data as Teacher | undefined;
    const settings = useTeacherSettingsForm(teacher);
    console.log("teacher data from the TeacherSetting page", teacher);
    if (isLoading) return <LoadingSpinner fullScreen />;
    if (error || !teacher) {
        return (
            <div className="p-8 text-red-500 text-sm">
                Failed to load teacher data.
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your faculty profile, course preferences, and account settings
                </p>
            </div>

            <TeacherSettingsHeader
                teacher={teacher}
                saved={settings.saved}
                onSave={settings.handleSave}
            />

            <TeacherStatsRow teacher={teacher} />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <SettingsTabBar
                    tabs={TABS}
                    activeTab={settings.activeTab}
                    onTabChange={settings.setActiveTab}
                />
                <div className="p-7">
                    {settings.activeTab === "profile" && (
                        <TeacherProfileTab form={settings.form} setForm={settings.setForm} />
                    )}
                    {settings.activeTab === "courses" && (
                        <TeacherCoursesTab
                            courses={teacher.courses || []}
                            coursePrefs={settings.coursePrefs}
                            setCoursePrefs={settings.setCoursePrefs}
                        />
                    )}
                    {settings.activeTab === "notifications" && (
                        <TeacherNotificationsTab
                            notifs={settings.notifs}
                            setNotifs={settings.setNotifs}
                        />
                    )}
                    {settings.activeTab === "preferences" && (
                        <TeacherPreferencesTab
                            preferences={settings.preferences}
                            setPreferences={settings.setPreferences}
                        />
                    )}
                    {settings.activeTab === "privacy" && (
                        <TeacherPrivacyTab
                            privacy={settings.privacy}
                            setPrivacy={settings.setPrivacy}
                        />
                    )}
                    {settings.activeTab === "security" && (
                        <SecurityTab
                            passwordStatus="Password is up to date. Last changed 12 days ago"
                            sessions={SESSIONS}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}