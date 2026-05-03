import { useState } from "react";
import CourseOverviewBanner from "./CourseOverviewBanner";
import CourseStatsGrid from "./CourseStatsGrid";
import CourseDeadlines from "./CourseDeadlines";
import CourseAnnouncementsList from "./CourseAnnouncementsList";
import CreateAnnouncementModal from "./CreateAnnouncementModal";
import { useCourseAnnouncements } from "../../CustomeHooks/CourseDetails/UseCourseAnnouncements";
import { useCourseEvents } from "../../CustomeHooks/CourseDetails/UseCourseEvents";
import { useCreateCourseAnnouncement } from "../../CustomeHooks/CourseDetails/UseCreateCourseAnnouncement";
import type { course } from "../../Interfaces/course";
import type { CourseDetailsStats } from "../../Interfaces/courseDetails";
import { toast } from "sonner";

interface CourseOverviewProps {
    course: course;
    displayName: string;
    userId: number;
    canCreateAnnouncements: boolean;
}

const MOCK_STATS: CourseDetailsStats = {
    lecturesDone: 8,
    totalLectures: 12,
    pendingTasks: 3,
    avgGrade: 87,
    classmates: 0,
};

export default function CourseOverview({ course, displayName, userId, canCreateAnnouncements }: CourseOverviewProps) {
    const { announcements } = useCourseAnnouncements(course.id);
    const { events } = useCourseEvents(userId);
    const { createCourseAnnouncement, isCreating, createError } = useCreateCourseAnnouncement(course.id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats: CourseDetailsStats = {
        ...MOCK_STATS,
        classmates: course.enrolledStudents > 0 ? course.enrolledStudents - 1 : 0,
    };

    const handleCreateAnnouncement = async ({ title, content }: { title: string; content: string }) => {
        await createCourseAnnouncement({
            title,
            content,
            courseId: course.id,
        });
        toast.success("Announcement created successfully.");
        setIsModalOpen(false);
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
                <CourseAnnouncementsList
                    announcements={announcements}
                    canCreate={canCreateAnnouncements}
                    onCreateClick={() => setIsModalOpen(true)}
                />
            </div>

            <CreateAnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAnnouncement}
                isPending={isCreating}
                errorMessage={createError}
            />
        </div>
    );
}
