package com.uni.iam.service.impl;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.AnnouncementSummaryResponse;
import com.uni.iam.dto.response.TeacherCourseResponse;
import com.uni.iam.dto.response.TeacherProfileResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.entity.Teacher;
import com.uni.iam.exception.UserNotFoundException;
import com.uni.iam.repository.TeacherRepository;
import com.uni.iam.service.interfaces.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final AcademicCoreClient academicCoreClient;

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::toTeacherResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherProfileResponse getTeacherDetails(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        List<AcademicCoreClient.CourseRemoteResponse> courses = academicCoreClient.getCoursesByTeacherId(id);
        List<TeacherCourseResponse> courseResponses = courses.stream()
                .map(course -> TeacherCourseResponse.builder()
                        .id(course.getId())
                        .name(course.getName())
                        .description(course.getDescription())
                        .departmentName(teacher.getOfficeLocation() != null ? teacher.getOfficeLocation() : "N/A")
                        .teacherUserName(teacher.getUsername())
                        .creditHours(course.getCredits())
                        .maxStudents(course.getMaxStudents())
                        .enrolledStudents(course.getEnrolledCount())
                        .build())
                .toList();

        List<AnnouncementSummaryResponse> announcements = courses.stream()
                .flatMap(course -> academicCoreClient.getAnnouncementsByCourseId(course.getId()).stream())
                .map(announcement -> AnnouncementSummaryResponse.builder()
                        .id(announcement.getId())
                        .title(announcement.getTitle())
                        .description(announcement.getDescription())
                        .createdAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().toString() : null)
                        .type("default")
                        .build())
                .toList();

        return TeacherProfileResponse.builder()
                .teacherId(teacher.getId())
                .role(teacher.getRole().name().toLowerCase())
                .name(teacher.getUsername())
                .email(teacher.getEmail())
                .salary(teacher.getSalary() != null ? teacher.getSalary() : BigDecimal.ZERO)
                .department(teacher.getOfficeLocation() != null ? teacher.getOfficeLocation() : "N/A")
                .courses(courseResponses)
                .announcements(announcements)
                .upcomingEvents(courseResponses.stream()
                        .map(course -> com.uni.iam.dto.response.UpcomingEventResponse.builder()
                                .id(course.getId())
                                .title(course.getName() + " deadline")
                                .description(course.getDescription())
                                .date(courses.stream()
                                        .filter(remoteCourse -> remoteCourse.getId().equals(course.getId()))
                                        .findFirst()
                                        .map(remoteCourse -> remoteCourse.getEndDate() != null
                                                ? remoteCourse.getEndDate().toString()
                                                : null)
                                        .orElse(null))
                                .type("Event")
                                .build())
                        .toList())
                .coursesCount(courseResponses.size())
                .numberOfStudents(
                        courses.stream().mapToInt(AcademicCoreClient.CourseRemoteResponse::getEnrolledCount).sum())
                .build();
    }

    private TeacherResponse toTeacherResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .username(teacher.getUsername())
                .email(teacher.getEmail())
                .role(teacher.getRole())
                .createdAt(teacher.getCreatedAt())
                .officeLocation(teacher.getOfficeLocation())
                .salary(teacher.getSalary())
                .build();
    }
}
