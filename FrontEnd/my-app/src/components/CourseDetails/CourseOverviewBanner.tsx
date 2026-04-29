import type { course } from "../../Interfaces/course";

interface CourseOverviewBannerProps {
    course: course;
    displayName: string;
    progress?: number;
    lecturesDone?: number;
    totalLectures?: number;
}

export default function CourseOverviewBanner({
    course,
    displayName,
    progress = 65,
    lecturesDone = 8,
    totalLectures = 12,
}: CourseOverviewBannerProps) {
    return (
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-7 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-24 translate-x-24 pointer-events-none" />
            <div className="absolute bottom-0 right-20 w-40 h-40 bg-white opacity-5 rounded-full translate-y-12 pointer-events-none" />

            <div className="relative z-10">
                <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
                    {course.courseCode} · {course.name}
                </span>

                <h2 className="text-2xl font-bold mt-2">
                    Welcome back, {displayName} 👋
                </h2>

                <p className="text-blue-100 text-sm mt-1">
                    You've completed {lecturesDone} of {totalLectures} lectures. Keep it up!
                </p>

                <div className="mt-5">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-blue-100">Course Progress</span>
                        <span className="text-xs font-bold text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
