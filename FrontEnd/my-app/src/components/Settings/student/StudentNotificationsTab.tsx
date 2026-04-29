import SettingsToggle from "../shared/SettingsToggle";
import type { StudentNotificationSettings } from "../../../Interfaces/settings";

interface StudentNotificationsTabProps {
    notifs: StudentNotificationSettings;
    setNotifs: (n: StudentNotificationSettings) => void;
}

export default function StudentNotificationsTab({ notifs, setNotifs }: StudentNotificationsTabProps) {
    const update = (key: keyof StudentNotificationSettings) => (val: boolean) =>
        setNotifs({ ...notifs, [key]: val });

    return (
        <div className="max-w-lg">
            <p className="text-sm text-gray-400 mb-4">
                Choose what notifications you receive and how
            </p>
            <SettingsToggle
                label="Grade Updates"
                desc="Get notified when grades are posted"
                checked={notifs.gradeUpdates}
                onChange={update("gradeUpdates")}
            />
            <SettingsToggle
                label="Course Announcements"
                desc="Instructor posts and updates"
                checked={notifs.courseAnnouncements}
                onChange={update("courseAnnouncements")}
            />
            <SettingsToggle
                label="Schedule Changes"
                desc="Class cancellations and room changes"
                checked={notifs.scheduleChanges}
                onChange={update("scheduleChanges")}
            />
            <SettingsToggle
                label="Weekly Email Digest"
                desc="Summary of your weekly activity"
                checked={notifs.emailDigest}
                onChange={update("emailDigest")}
            />
            <SettingsToggle
                label="SMS Alerts"
                desc="Critical alerts via text message"
                checked={notifs.smsAlerts}
                onChange={update("smsAlerts")}
            />
        </div>
    );
}
