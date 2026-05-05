package com.unisystem.api_gateway.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {
    }

    public record StudentProfileDto(
            Long id,
            String role,
            String username,
            String email,
            BigDecimal gpa,
            Integer totalCredits,
            List<EnrolledCourseSummaryDto> enrolledCourses,
            Integer enrolledCoursesCount,
            Integer enrollmentYear,
            String academicStanding,
            List<AnnouncementSummaryDto> announcements,
            List<UpcomingEventDto> upcomingEvents) {
    }

    public record TeacherProfileDto(
            Long teacherId,
            String role,
            String name,
            String email,
            BigDecimal salary,
            String department,
            List<TeacherCourseSummaryDto> courses,
            List<AnnouncementSummaryDto> announcements,
            List<UpcomingEventDto> upcomingEvents,
            Integer coursesCount,
            Integer numberOfStudents) {
    }

    public record EnrolledCourseSummaryDto(
            Long id,
            Long studentId,
            String studentName,
            Long courseId,
            String courseCode,
            String courseName,
            String teacherName,
            Integer credits,
            String startDate,
            String endDate,
            String enrollmentDate) {
    }

    public record TeacherCourseSummaryDto(
            Long id,
            String name,
            String description,
            String departmentName,
            String teacherUserName,
            Integer creditHours,
            Integer maxStudents,
            Integer enrolledStudents) {
    }

    public record AnnouncementSummaryDto(
            Long id,
            String title,
            String description,
            String createdAt,
            String type) {
    }

    public record UpcomingEventDto(
            Long id,
            String title,
            String description,
            String date,
            String type) {
    }

    public record UserDto(
            Long id,
            String username,
            String email,
            String role) {
    }

    public record EnrollmentDto(
            Long id,
            Long studentId,
            Long courseId,
            LocalDateTime enrolledAt) {
    }

    public record CourseDto(
            Long id,
            String name,
            String courseCode,
            String description,
            LocalDate startDate,
            LocalDate endDate,
            LocalDate createdAt,
            Integer credits,
            Integer maxStudents,
            Integer enrolledCount,
            Long departmentId,
            Long teacherId) {
    }

    public record CourseIdsRequestDto(List<Long> ids) {
    }

    public record StudentDashboardResponseDto(
            StudentProfileDto profile,
            List<EnrollmentDto> enrollments,
            List<CourseDto> courses) {
    }

    public record TeacherDashboardResponseDto(
            TeacherProfileDto profile,
            List<TeacherCourseSummaryDto> courses,
            Integer coursesCount) {
    }

    public record AdminDashboardResponseDto(
            Long id,
            String username,
            String email,
            String role) {
    }

    public record UserDashboardResponseDto(
            UserDto user,
            String role,
            StudentDashboardResponseDto studentDashboard,
            TeacherDashboardResponseDto teacherDashboard,
            AdminDashboardResponseDto adminDashboard) {
    }
}
