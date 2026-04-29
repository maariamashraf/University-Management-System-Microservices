import { useState, useEffect } from "react";
import type {
    TeacherProfileForm,
    TeacherNotificationSettings,
    TeacherPrivacySettings,
    TeacherCoursePreferences,
    TeacherPreferences,
} from "../../Interfaces/settings";
import type { Teacher } from "../../Interfaces/teacher";

export function useTeacherSettingsForm(teacher: Teacher | undefined) {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState<TeacherProfileForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        facultyId: "",
        department: "",
        title: "Associate Professor",
        office: "",
        officeHours: "",
        bio: "",
        website: "",
        researchArea: "",
    });

    const [notifs, setNotifs] = useState<TeacherNotificationSettings>({
        studentSubmissions: true,
        gradeReminders: true,
        courseEnrollments: true,
        systemUpdates: false,
        emailDigest: true,
        smsAlerts: false,
    });

    const [coursePrefs, setCoursePrefs] = useState<TeacherCoursePreferences>({
        lateSubmissions: true,
        autoReminders: true,
        discussionAlerts: false,
        attendanceTracking: true,
    });

    const [privacy, setPrivacy] = useState<TeacherPrivacySettings>({
        showOfficeHours: true,
        showEmail: true,
        showResearch: true,
        showPhone: false,
    });

    const [preferences, setPreferences] = useState<TeacherPreferences>({
        gradingScale: "Standard (A-F)",
        defaultLang: "English",
        timezone: "Africa/Cairo (GMT+2)",
    });

    useEffect(() => {
        if (!teacher?.name) return;
        const parts = teacher.name.split(" ");
        setForm(prev => ({
            ...prev,
            firstName: parts[0] ?? "",
            lastName: parts.slice(1).join(" ") ?? "",
            email: teacher.email,
            facultyId: `HU-FAC-${String(teacher.teacherId).padStart(4, "0")}`,
            department: teacher.department,
        }));
    }, [teacher]);

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
        coursePrefs,
        setCoursePrefs,
        privacy,
        setPrivacy,
        preferences,
        setPreferences,
        handleSave,
    };
}
