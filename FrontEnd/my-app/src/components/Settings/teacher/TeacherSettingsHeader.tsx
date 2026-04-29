import SettingsAvatar from "../shared/SettingsAvatar";
import type { Teacher } from "../../../Interfaces/teacher";

interface TeacherSettingsHeaderProps {
    teacher: Teacher;
    saved: boolean;
    onSave: () => void;
}

function buildFacultyId(teacher: Teacher): string {
    return `HU-FAC-${String(teacher.teacherId).padStart(4, "0")}`;
}

export default function TeacherSettingsHeader({ teacher, saved, onSave }: TeacherSettingsHeaderProps) {
    const tags = [teacher.department, `${teacher.coursesCount} Courses`, `${teacher.numberOfStudents} Students`];

    return (
        <div className="bg-white rounded-2xl p-6 mb-5 flex items-center gap-6 shadow-sm">
            <div className="relative">
                <SettingsAvatar name={teacher.name} size="lg" />
                <button
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 border-2 border-white
                        text-white text-xs flex items-center justify-center hover:bg-blue-700 transition"
                    aria-label="Edit avatar"
                >
                    ✏
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-gray-900 truncate">{teacher.name}</p>
                <p className="text-sm text-gray-400 mt-0.5 truncate">
                    {teacher.email} · Faculty ID: {buildFacultyId(teacher)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={onSave}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md flex-shrink-0
                    ${saved
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                    }`}
            >
                {saved ? "✓ Saved!" : "Save Changes"}
            </button>
        </div>
    );
}
