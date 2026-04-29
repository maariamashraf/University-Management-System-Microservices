import { useGetStudentSettins } from "../../CustomeHooks/UserHooks/UseGetStudentSettins";
import { useStudentSettingsForm } from "../../CustomeHooks/UserHooks/UseStudentSettingsForm";
import StudentSettingsHeader from "../../components/Settings/student/StudentSettingsHeader";
import StudentStatsRow from "../../components/Settings/student/StudentStatsRow";
import StudentProfileTab from "../../components/Settings/student/StudentProfileTab";
import StudentNotificationsTab from "../../components/Settings/student/StudentNotificationsTab";
import StudentPrivacyTab from "../../components/Settings/student/StudentPrivacyTab";
import SecurityTab from "../../components/Settings/shared/SecurityTab";
import SettingsTabBar from "../../components/Settings/shared/SettingsTabBar";
import LoadingSpinner from "../../components/common/LodingSpinner";
import type { Student } from "../../Interfaces/student";
import type { ActiveSession } from "../../Interfaces/settings";

const TABS = [
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
    { key: "privacy", label: "Privacy" },
];

const SESSIONS: ActiveSession[] = [
    { device: "Chrome · Cairo, EG", time: "Now", isCurrent: true },
    { device: "Mobile App · Cairo, EG", time: "2 hours ago", isCurrent: false },
];

export default function StudentSetting() {
    const { data, isLoading, error } = useGetStudentSettins();
    const student = data as Student | undefined;
    const settings = useStudentSettingsForm(student);

    if (isLoading) return <LoadingSpinner fullScreen />;
    if (error || !student) {
        return (
            <div className="p-8 text-red-500 text-sm">
                Failed to load student data.
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your account preferences and profile information
                </p>
            </div>

            <StudentSettingsHeader
                student={student}
                saved={settings.saved}
                onSave={settings.handleSave}
            />

            <StudentStatsRow student={student} />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <SettingsTabBar
                    tabs={TABS}
                    activeTab={settings.activeTab}
                    onTabChange={settings.setActiveTab}
                />
                <div className="p-7">
                    {settings.activeTab === "profile" && (
                        <StudentProfileTab form={settings.form} setForm={settings.setForm} />
                    )}
                    {settings.activeTab === "security" && (
                        <SecurityTab
                            passwordStatus="Password last changed 45 days ago"
                            sessions={SESSIONS}
                        />
                    )}
                    {settings.activeTab === "notifications" && (
                        <StudentNotificationsTab
                            notifs={settings.notifs}
                            setNotifs={settings.setNotifs}
                        />
                    )}
                    {settings.activeTab === "privacy" && (
                        <StudentPrivacyTab
                            privacy={settings.privacy}
                            setPrivacy={settings.setPrivacy}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}