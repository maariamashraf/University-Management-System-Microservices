package com.uni.iam.service.Mappers;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.EnrolledCourseResponse;
import com.uni.iam.entity.Student;
import com.uni.iam.entity.Teacher;
import com.uni.iam.repository.TeacherRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
public class EnrollmentMapper {

    public List<EnrolledCourseResponse> toEnrolledCourseResponses(
            List<AcademicCoreClient.EnrollmentRemoteResponse> enrollments,
            Student student,
            AcademicCoreClient academicCoreClient,
            TeacherRepository teacherRepository) {

        return enrollments.stream()
                .map(enrollment -> {
                    var course = academicCoreClient.getCourseById(enrollment.getCourseId());
                    if (course == null)
                        return null;
                    Long teacherId = course.getTeacherId();
                    String teacherName = "Unknown";
                    if (teacherId != null) {
                        teacherName = teacherRepository.findById(teacherId).map(Teacher::getUsername).orElse("Unknown");
                    }
                    return EnrolledCourseResponse.builder()
                            .id(enrollment.getId())
                            .studentId(student.getId())
                            .studentName(student.getUsername())
                            .courseId(course.getId())
                            .courseCode(course.getCourseCode())
                            .courseName(course.getName())
                            .teacherName(teacherName)
                            .credits(course.getCredits())
                            .startDate(course.getStartDate() != null ? course.getStartDate().toString() : null)
                            .endDate(course.getEndDate() != null ? course.getEndDate().toString() : null)
                            .enrollmentDate(
                                    enrollment.getEnrolledAt() != null ? enrollment.getEnrolledAt().toString() : null)
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }
}
