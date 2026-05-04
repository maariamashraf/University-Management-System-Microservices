package com.uni.iam.service.impl;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.AnnouncementSummaryResponse;
import com.uni.iam.dto.response.EnrolledCourseResponse;
import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.entity.Student;
import com.uni.iam.entity.Teacher;
import com.uni.iam.exception.UserNotFoundException;
import com.uni.iam.repository.StudentRepository;
import com.uni.iam.repository.TeacherRepository;
import com.uni.iam.service.interfaces.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AcademicCoreClient academicCoreClient;

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toStudentResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentDetails(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        List<AcademicCoreClient.EnrollmentRemoteResponse> enrollments = academicCoreClient
                .getEnrollmentsByStudentId(id);

        List<EnrolledCourseResponse> enrolledCourseResponses = enrollments.stream()
                .map(enrollment -> academicCoreClient.getCourseById(enrollment.getCourseId()))
                .filter(java.util.Objects::nonNull)
                .map(course -> {
                    Teacher teacher = teacherRepository.findById(course.getTeacherId()).orElse(null);
                    String teacherName = teacher != null ? teacher.getUsername() : "Unknown";
                    AcademicCoreClient.EnrollmentRemoteResponse enrollment = enrollments.stream()
                            .filter(item -> item.getCourseId().equals(course.getId()))
                            .findFirst()
                            .orElse(null);
                    return EnrolledCourseResponse.builder()
                            .id(enrollment != null ? enrollment.getId() : null)
                            .studentId(student.getId())
                            .studentName(student.getUsername())
                            .courseId(course.getId())
                            .courseCode(course.getCourseCode())
                            .courseName(course.getName())
                            .teacherName(teacherName)
                            .credits(course.getCredits())
                            .startDate(course.getStartDate() != null ? course.getStartDate().toString() : null)
                            .endDate(course.getEndDate() != null ? course.getEndDate().toString() : null)
                            .enrollmentDate(enrollment != null && enrollment.getEnrolledAt() != null
                                    ? enrollment.getEnrolledAt().toString()
                                    : null)
                            .build();
                })
                .toList();

        List<AnnouncementSummaryResponse> announcements = enrolledCourseResponses.stream()
                .map(EnrolledCourseResponse::getCourseId)
                .distinct()
                .flatMap(courseId -> academicCoreClient.getAnnouncementsByCourseId(courseId).stream())
                .map(announcement -> AnnouncementSummaryResponse.builder()
                        .id(announcement.getId())
                        .title(announcement.getTitle())
                        .description(announcement.getDescription())
                        .createdAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().toString() : null)
                        .type("default")
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
                .academicStanding(determineAcademicStanding(student.getGpa()))
                .announcements(announcements)
                .upcomingEvents(enrolledCourseResponses.stream()
                        .map(course -> com.uni.iam.dto.response.UpcomingEventResponse.builder()
                                .id(course.getCourseId())
                                .title(course.getCourseName() + " deadline")
                                .description(course.getTeacherName())
                                .date(course.getEndDate())
                                .type("Event")
                                .build())
                        .toList())
                .build();
    }

    private String determineAcademicStanding(BigDecimal gpa) {
        if (gpa == null) {
            return "Good Standing";
        }
        if (gpa.compareTo(BigDecimal.valueOf(3.5)) >= 0) {
            return "Excellent";
        }
        if (gpa.compareTo(BigDecimal.valueOf(2.5)) >= 0) {
            return "Good Standing";
        }
        return "Probation";
    }

    private StudentResponse toStudentResponse(Student student) {
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
}
