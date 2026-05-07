import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
    TeacherProfileForm,
    TeacherNotificationSettings,
    TeacherPrivacySettings,
    TeacherCoursePreferences,
    TeacherPreferences,
} from "../../Interfaces/settings";
import type { Teacher } from "../../Interfaces/teacher";
import { getUserId, removeToken, removeUserPermissions } from "../../Services/authService";
import { updateUserProfile } from "../../Services/userService";
import { toast } from "sonner";

export function useTeacherSettingsForm(teacher: Teacher | undefined) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = async () => {
        if (!teacher) return;
        const userId = getUserId();
        setIsSaving(true);
        setSaved(false);
        try {
            const username = `${form.firstName} ${form.lastName}`.trim().replace(/\s+/g, " ");
            const email = form.email.trim();
            await updateUserProfile(userId, {
                username,
                email,
            });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["user"] }),
                queryClient.invalidateQueries({ queryKey: ["teacher", userId] }),
            ]);

            const identityChanged = username !== teacher.name || email !== teacher.email;
            if (identityChanged) {
                toast.success("Profile updated. Please log in again to refresh your session.");
                removeToken();
                removeUserPermissions();
                window.location.href = "/auth/login";
                return;
            }
            setSaved(true);
            toast.success("Profile updated successfully");
            setTimeout(() => setSaved(false), 2500);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update profile";
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        saved,
        isSaving,
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
