package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Mappers;

import org.springframework.stereotype.Component;

import com.unisystem.academic_core_service.domain.application.port.in.CreateCourseUseCase;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request.CreateCourseRequest;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request.UpdateCourseRequest;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.CoureseDetailsResponse;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.CourseCardResponse;

@Component
public class CourseMapper {

 public CoureseDetailsResponse courseToCoureseDetailsResponse(Course course,String teacherUserName) {

     CoureseDetailsResponse response = CoureseDetailsResponse.builder()
             .id(course.getId())
             .name(course.getName())
             .description(course.getDescription())
             .courseCode(course.getCourseCode())
             .startDate(course.getStartDate())
             .endDate(course.getEndDate())
             .credits(course.getCredits())
             .maxStudents(course.getMaxStudents())
             .enrolledCount(course.getEnrolledCount())
             .teacherId(course.getTeacherId() == null ? 0 : Math.toIntExact(course.getTeacherId()))
             .teacherName(teacherUserName)
             .build();

     return response;
 }

 public CreateCourseUseCase.CreateCourseCommand courseRequestToCreateCourseCommand(CreateCourseRequest request,
                                                                                   Long teacherId,
                                                                                   Long  departmentId) {
     return new CreateCourseUseCase.CreateCourseCommand(
             request.name(),
             request.courseCode(),
             request.description(),
             request.maxStudents(),
             request.creditHours(),
             departmentId,
             teacherId,
             request.startDate(),
             request.endDate()
     );
 }

 public Course UpdateCourseRequestToCourse(UpdateCourseRequest request,Course existingCourse,Long teacherId,Long departmentId) {
     existingCourse.setName(request.name());
     existingCourse.setDescription(request.description());
     existingCourse.setCourseCode(request.courseCode());
     existingCourse.setMaxStudents(request.maxStudents());
     existingCourse.setCredits(request.creditHours());
     existingCourse.setStartDate(request.startDate());
     existingCourse.setEndDate(request.endDate());
        existingCourse.setTeacherId(teacherId);
        existingCourse.setDepartmentId(departmentId);
     return existingCourse;
 }

  public CourseCardResponse courseToCourseCardResponse(Course course,String teacherName) {
      return CourseCardResponse.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .description(course.getDescription())
                            .courseCode(course.getCourseCode())
                            .startDate(course.getStartDate())
                            .endDate(course.getEndDate())
                            .teacherName(teacherName)
                            .teacherUserName(teacherName)
                            .credits(course.getCredits())
                            .creditHours(course.getCredits())
                            .maxStudents(course.getMaxStudents())
                            .enrolledCount(course.getEnrolledCount())
                            .enrolledStudents(course.getEnrolledCount())
                            .build();

  }
}
