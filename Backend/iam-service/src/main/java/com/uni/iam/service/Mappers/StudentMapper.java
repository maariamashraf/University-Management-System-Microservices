package com.uni.iam.service.Mappers;

import com.uni.iam.dto.response.AnnouncementSummaryResponse;
import com.uni.iam.dto.response.EnrolledCourseResponse;
import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.UpcomingEventResponse;
import com.uni.iam.entity.Student;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;

@Component
public class StudentMapper {

    public StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .username(student.getUsername())
                .email(student.getEmail())
                .role(student.getRole())
                .createdAt(student.getCreatedAt())
                .gpa(student.getGpa())
                .enrollmentDate(student.getEnrollmentDate())
                .totalCredits(student.getTotalCredits())
                .build();
    }

    public StudentProfileResponse toStudentProfileResponse(
            Student student,
            List<EnrolledCourseResponse> enrolledCourseResponses,
            List<AnnouncementSummaryResponse> announcements,
            String academicStanding) {

        List<UpcomingEventResponse> upcomingEvents = enrolledCourseResponses.stream()
                .map(course -> UpcomingEventResponse.builder()
                        .id(course.getCourseId())
                        .title(course.getCourseName() + " deadline")
                        .description(course.getTeacherName())
                        .date(course.getEndDate())
                        .type("Event")
                        .build())
                .toList();

        return StudentProfileResponse.builder()
                .id(student.getId())
                .role(student.getRole().name().toLowerCase())
                .username(student.getUsername())
                .email(student.getEmail())
                .gpa(student.getGpa() != null ? student.getGpa() : BigDecimal.ZERO)
                .totalCredits(student.getTotalCredits() != null ? student.getTotalCredits() : 0)
                .enrolledCourses(enrolledCourseResponses)
                .enrolledCoursesCount(enrolledCourseResponses.size())
                .enrollmentYear(student.getEnrollmentDate() != null ? student.getEnrollmentDate().getYear()
                        : Year.now().getValue())
                .academicStanding(academicStanding)
                .announcements(announcements)
                .upcomingEvents(upcomingEvents)
                .build();
    }
}
