package com.uni.iam.service.Mappers;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.*;
import com.uni.iam.entity.Teacher;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TeacherMapper {


        public List<TeacherCourseResponse> toTeacherCourseResponses(List<AcademicCoreClient.CourseRemoteResponse> courses, Teacher teacher) {
        List<TeacherCourseResponse> teacherCourseResponses = courses.stream()
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
        return teacherCourseResponses;
  }

  public TeacherProfileResponse toTeacherProfileResponse(
          Teacher teacher,
          List<AcademicCoreClient.CourseRemoteResponse> courses,
          List<TeacherCourseResponse> courseResponses,
          List<AnnouncementSummaryResponse> announcements) {
      Map<Long, String> courseEndDateById = courses.stream()
              .collect(Collectors.toMap(
                      AcademicCoreClient.CourseRemoteResponse::getId,
                      course -> course.getEndDate() != null ? course.getEndDate().toString() : null,
                      (existing, replacement) -> existing));

      List<UpcomingEventResponse> upcomingEvents = courseResponses.stream()
              .map(course -> UpcomingEventResponse.builder()
                      .id(course.getId())
                      .title(course.getName() + " deadline")
                      .description(course.getDescription())
                      .date(courseEndDateById.get(course.getId()))
                      .type("Event")
                      .build())
              .toList();

      return TeacherProfileResponse.builder()
              .teacherId(teacher.getId())
              .role(teacher.getRole() != null ? teacher.getRole().name().toLowerCase() : null)
              .name(teacher.getUsername())
              .email(teacher.getEmail())
              .salary(teacher.getSalary() != null ? teacher.getSalary() : BigDecimal.ZERO)
              .department(teacher.getOfficeLocation() != null ? teacher.getOfficeLocation() : "N/A")
              .courses(courseResponses)
              .announcements(announcements)
              .upcomingEvents(upcomingEvents)
              .coursesCount(courseResponses.size())
              .numberOfStudents(courses.stream().mapToInt(AcademicCoreClient.CourseRemoteResponse::getEnrolledCount).sum())
              .build();
  }

  public TeacherResponse toTeacherResponse(Teacher teacher) {
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
  public TeacherBasicResponse toTeacherBasicResponse(Teacher teacher) {
      return TeacherBasicResponse.builder()
              .id(teacher.getId())
              .teacherName(teacher.getUsername())
              .officeLocation(teacher.getOfficeLocation())
              .build();
  }

}
