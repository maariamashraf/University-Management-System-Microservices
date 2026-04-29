import { Users } from "lucide-react";
import { getAvatarInitials } from "../../utils/avatarUtils";
import { useCourseStudents } from "../../CustomeHooks/CourseDetails/UseCourseStudents";

interface CourseStudentsTabProps {
    courseId: number;
}

function StudentRow({ studentName, enrollmentDate }: { studentName: string; enrollmentDate: string }) {
    const initials = getAvatarInitials(studentName);
    const enrolled = new Date(enrollmentDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{studentName}</p>
                <p className="text-xs text-gray-400">Enrolled {enrolled}</p>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                Active
            </span>
        </div>
    );
}

export default function CourseStudentsTab({ courseId }: CourseStudentsTabProps) {
    const { students, isLoading } = useCourseStudents(courseId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Users size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Enrolled Students</h3>
                        <p className="text-xs text-gray-500">{students.length} students enrolled</p>
                    </div>
                </div>
            </div>

            {students.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No students enrolled yet.</p>
            ) : (
                <div>
                    {students.map((s) => (
                        <StudentRow
                            key={s.id}
                            studentName={s.studentName}
                            enrollmentDate={s.enrollmentDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
