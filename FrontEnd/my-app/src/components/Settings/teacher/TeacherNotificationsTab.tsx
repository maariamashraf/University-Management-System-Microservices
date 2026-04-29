import SettingsToggle from "../shared/SettingsToggle";
import type { TeacherNotificationSettings } from "../../../Interfaces/settings";

interface TeacherNotificationsTabProps {
    notifs: TeacherNotificationSettings;
    setNotifs: (n: TeacherNotificationSettings) => void;
}

export default function TeacherNotificationsTab({ notifs, setNotifs }: TeacherNotificationsTabProps) {
    const update = (key: keyof TeacherNotificationSettings) => (val: boolean) =>
        setNotifs({ ...notifs, [key]: val });

    return (
        <div className="max-w-lg">
            <p className="text-sm text-gray-400 mb-4">
                Control how you receive updates about your courses and students
            </p>
            <SettingsToggle
                label="Student Submissions"
                desc="Notify when a student submits an assignment"
                checked={notifs.studentSubmissions}
                onChange={update("studentSubmissions")}
            />
            <SettingsToggle
                label="Grading Reminders"
                desc="Remind you of pending grades to submit"
                checked={notifs.gradeReminders}
                onChange={update("gradeReminders")}
            />
            <SettingsToggle
                label="Course Enrollments"
                desc="Alert when a student enrolls or drops"
                checked={notifs.courseEnrollments}
                onChange={update("courseEnrollments")}
            />
            <SettingsToggle
                label="System & Portal Updates"
                desc="News and maintenance notifications"
                checked={notifs.systemUpdates}
                onChange={update("systemUpdates")}
            />
            <SettingsToggle
                label="Weekly Email Digest"
                desc="Summary of all course activity"
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
