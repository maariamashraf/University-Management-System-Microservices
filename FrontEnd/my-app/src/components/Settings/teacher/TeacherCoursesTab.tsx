import SettingsToggle from "../shared/SettingsToggle";
import type { TeacherCourse } from "../../../Interfaces/teacher";
import type { TeacherCoursePreferences } from "../../../Interfaces/settings";

interface TeacherCoursesTabProps {
    courses: TeacherCourse[];
    coursePrefs: TeacherCoursePreferences;
    setCoursePrefs: (p: TeacherCoursePreferences) => void;
}

function CourseCard({ course }: { course: TeacherCourse }) {
    const features = [
        { label: "Late Submissions", active: true },
        { label: "Auto Reminders", active: true },
        { label: "Attendance", active: false },
    ];
    console.log(course);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex justify-between items-center">
                <div>
                    <p className="text-blue-100 text-xs font-semibold">
                        {course.departmentName} · {course.creditHours} Credits
                    </p>
                    <p className="text-white text-sm font-bold mt-0.5">{course.name}</p>
                </div>
                <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full flex-shrink-0">
                    👥 {course.enrolledStudents}/{course.maxStudents}
                </span>
            </div>
            <div className="px-4 py-3 flex gap-4">
                {features.map(f => (
                    <div key={f.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${f.active ? "bg-green-500" : "bg-gray-300"}`} />
                        {f.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function TeacherCoursesTab({ courses, coursePrefs, setCoursePrefs }: TeacherCoursesTabProps) {
    const update = (key: keyof TeacherCoursePreferences) => (val: boolean) =>
        setCoursePrefs({ ...coursePrefs, [key]: val });
    
    console.log(courses);
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">Your current semester course assignments</p>
                <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full">
                    Spring 2026
                </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
                {courses.length == 0 && <div className="text-center text-gray-500">No courses found</div>}
                {courses.length > 0 && courses.map(c => (
                    <CourseCard key={c.id} course={c} />
                ))}
            </div>

            <div className="border-t border-gray-100 pt-5">
                <p className="text-sm font-bold text-gray-800 mb-3">Default Course Settings</p>
                <SettingsToggle
                    label="Allow Late Submissions"
                    desc="Students can submit after deadline with penalty"
                    checked={coursePrefs.lateSubmissions}
                    onChange={update("lateSubmissions")}
                />
                <SettingsToggle
                    label="Auto Assignment Reminders"
                    desc="Notify students 24h before due date"
                    checked={coursePrefs.autoReminders}
                    onChange={update("autoReminders")}
                />
                <SettingsToggle
                    label="Discussion Board Alerts"
                    desc="Get notified on new student posts"
                    checked={coursePrefs.discussionAlerts}
                    onChange={update("discussionAlerts")}
                />
                <SettingsToggle
                    label="Attendance Tracking"
                    desc="Automatically track class attendance"
                    checked={coursePrefs.attendanceTracking}
                    onChange={update("attendanceTracking")}
                />
            </div>
        </div>
    );
}
