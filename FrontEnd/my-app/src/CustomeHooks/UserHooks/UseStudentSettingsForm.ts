import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
    StudentProfileForm,
    StudentNotificationSettings,
    StudentPrivacySettings,
} from "../../Interfaces/settings";
import type { Student } from "../../Interfaces/student";
import { getUserId, removeToken, removeUserPermissions } from "../../Services/authService";
import { updateUserProfile } from "../../Services/userService";
import { toast } from "sonner";

export function useStudentSettingsForm(student: Student | undefined) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = async () => {
        if (!student) return;
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
                queryClient.invalidateQueries({ queryKey: ["student", userId] }),
            ]);

            const identityChanged = username !== student.username || email !== student.email;
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
        privacy,
        setPrivacy,
        handleSave,
    };
}
