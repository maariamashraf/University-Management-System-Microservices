package com.uni.iam.service.impl.StudentSerivces;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.EnrolledCourseResponse;
import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.entity.Student;
import com.uni.iam.repository.TeacherRepository;
import com.uni.iam.service.Mappers.AnnouncementMapper;
import com.uni.iam.service.Mappers.EnrollmentMapper;
import com.uni.iam.service.Mappers.StudentMapper;
import com.uni.iam.service.interfaces.AcademicStandingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicAggregationService {
    private final AcademicCoreClient academicCoreClient;
    private final AnnouncementMapper announcementMapper;
    private final EnrollmentMapper enrollmentMapper;
    private final TeacherRepository teacherRepository;
    private final List<AcademicStandingStrategy> academicStandingStrategies;
    private final StudentMapper studentMapper;

    public StudentProfileResponse assembleStudentProfile(Student student) {
        var enrollments = academicCoreClient.getEnrollmentsByStudentId(student.getId());

        var enrolledCourseResponses = enrollmentMapper.toEnrolledCourseResponses(enrollments, student, academicCoreClient, teacherRepository);

        var courseIds = enrolledCourseResponses.stream().map(EnrolledCourseResponse::getCourseId).distinct().toList();
        var announcements = announcementMapper.toAnnouncementSummariesByCourseIds(courseIds, academicCoreClient);

        String standing = determineStanding(student.getGpa(), "STANDARD");

        return studentMapper.toStudentProfileResponse(student, enrolledCourseResponses, announcements, standing);
    }

    private String determineStanding(BigDecimal gpa, String type) {
        return academicStandingStrategies.stream()
                .filter(s -> s.isApplicable(type))
                .findFirst()
                .orElseThrow()
                .determineStanding(gpa);
    }
}