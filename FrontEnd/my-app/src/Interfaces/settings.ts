export interface StudentProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    studentId: string;
    major: string;
    year: string;
    bio: string;
}

export interface TeacherProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    facultyId: string;
    department: string;
    title: string;
    office: string;
    officeHours: string;
    bio: string;
    website: string;
    researchArea: string;
}

export interface StudentNotificationSettings {
    gradeUpdates: boolean;
    courseAnnouncements: boolean;
    scheduleChanges: boolean;
    emailDigest: boolean;
    smsAlerts: boolean;
}

export interface TeacherNotificationSettings {
    studentSubmissions: boolean;
    gradeReminders: boolean;
    courseEnrollments: boolean;
    systemUpdates: boolean;
    emailDigest: boolean;
    smsAlerts: boolean;
}

export interface StudentPrivacySettings {
    showProfile: boolean;
    showGrades: boolean;
    showSchedule: boolean;
}

export interface TeacherPrivacySettings {
    showOfficeHours: boolean;
    showEmail: boolean;
    showResearch: boolean;
    showPhone: boolean;
}

export interface TeacherCoursePreferences {
    lateSubmissions: boolean;
    autoReminders: boolean;
    discussionAlerts: boolean;
    attendanceTracking: boolean;
}

export interface TeacherPreferences {
    gradingScale: string;
    defaultLang: string;
    timezone: string;
}

export interface ActiveSession {
    device: string;
    time: string;
    isCurrent: boolean;
}
