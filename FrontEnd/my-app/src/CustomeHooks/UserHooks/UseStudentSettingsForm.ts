import { useState, useEffect } from "react";
import type {
    StudentProfileForm,
    StudentNotificationSettings,
    StudentPrivacySettings,
} from "../../Interfaces/settings";
import type { Student } from "../../Interfaces/student";

export function useStudentSettingsForm(student: Student | undefined) {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState<StudentProfileForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        studentId: "",
        major: "Computer Science",
        year: "",
        bio: "",
    });

    const [notifs, setNotifs] = useState<StudentNotificationSettings>({
        gradeUpdates: true,
        courseAnnouncements: true,
        scheduleChanges: false,
        emailDigest: true,
        smsAlerts: false,
    });

    const [privacy, setPrivacy] = useState<StudentPrivacySettings>({
        showProfile: true,
        showGrades: false,
        showSchedule: true,
    });

    useEffect(() => {
        if (!student) return;
        const parts = student.username.split(" ");
        setForm(prev => ({
            ...prev,
            firstName: parts[0] ?? "",
            lastName: parts.slice(1).join(" ") ?? "",
            email: student.email,
            studentId: `HU-${student.enrollmentYear}-${String(student.id).padStart(4, "0")}`,
            year: student.academicStanding,
        }));
    }, [student]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return {
        activeTab,
        setActiveTab,
        saved,
        form,
        setForm,
        notifs,
        setNotifs,
        privacy,
        setPrivacy,
        handleSave,
    };
}
