import CourseOverviewBanner from "./CourseOverviewBanner";
import CourseStatsGrid from "./CourseStatsGrid";
import CourseDeadlines from "./CourseDeadlines";
import CourseAnnouncementsList from "./CourseAnnouncementsList";
import { useCourseAnnouncements } from "../../CustomeHooks/CourseDetails/UseCourseAnnouncements";
import { useCourseEvents } from "../../CustomeHooks/CourseDetails/UseCourseEvents";
import type { course } from "../../Interfaces/course";
import type { CourseDetailsStats } from "../../Interfaces/courseDetails";

interface CourseOverviewProps {
    course: course;
    displayName: string;
    userId: number;
}

const MOCK_STATS: CourseDetailsStats = {
    lecturesDone: 8,
    totalLectures: 12,
    pendingTasks: 3,
    avgGrade: 87,
    classmates: 0,
};

export default function CourseOverview({ course, displayName, userId }: CourseOverviewProps) {
    const { announcements } = useCourseAnnouncements(course.id);
    const { events } = useCourseEvents(userId);

    const stats: CourseDetailsStats = {
        ...MOCK_STATS,
        classmates: course.enrolledStudents > 0 ? course.enrolledStudents - 1 : 0,
    };

    return (
        <div className="space-y-6">
            <CourseOverviewBanner
                course={course}
                displayName={displayName}
                progress={65}
                lecturesDone={stats.lecturesDone}
                totalLectures={stats.totalLectures}
            />

            <CourseStatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CourseDeadlines events={events} />
                <CourseAnnouncementsList announcements={announcements} />
            </div>
        </div>
    );
}
