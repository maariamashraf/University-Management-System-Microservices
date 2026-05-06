package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.CreateCourseUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.exceptions.CourseNotFoundException;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.AuditLog;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request.CreateCourseRequest;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.CourseCardResponse;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.CoureseDetailsResponse;
import com.unisystem.academic_core_service.infrastructure.adapters.out.iam.IamClient;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.DepartmentEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.DepartmentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CreateCourseUseCase createCourseUseCase;
    private final GetCoursesQuery getCoursesQuery;
    private final CourseRepositoryPort courseRepositoryPort;
    private final DepartmentJpaRepository departmentJpaRepository;
    private final IamClient iamClient;

    @AuditLog(action = "CREATE_COURSE")
    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestBody CreateCourseRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        Long teacherId = resolveTeacherId(userIdHeader, request.userId());
        Long departmentId = resolveDepartmentId(request.departmentName());

        CreateCourseUseCase.CreateCourseCommand command = new CreateCourseUseCase.CreateCourseCommand(
                request.name(),
                request.courseCode(),
                request.description(),
                request.maxStudents(),
                request.creditHours(),
                departmentId,
                teacherId,
                request.startDate(),
                request.endDate());

        Course course = createCourseUseCase.create(command);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        getCoursesQuery.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        courseRepositoryPort.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoureseDetailsResponse> getCourseById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Course course = getCoursesQuery.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        IamClient.TeacherBasicResponse teacherBasic = course.getTeacherId() == null
                ? null
                : iamClient.getTeacherBasic(course.getTeacherId(), authHeader);

        String teacherUserName = teacherBasic == null ? null : teacherBasic.getTeacherName();

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

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseCardResponse>> getAllCourses(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<Course> courses = getCoursesQuery.findAll();
        List<CourseCardResponse> response = courses.stream()
                .map(course -> {
                    IamClient.TeacherBasicResponse teacherBasic = course.getTeacherId() == null
                            ? null
                            : iamClient.getTeacherBasic(course.getTeacherId(), authHeader);

                    String teacherName = teacherBasic == null ? null : teacherBasic.getTeacherName();

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
                })
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/by-ids")
    public ResponseEntity<List<Course>> getCoursesByIds(@RequestBody CourseIdsRequest request) {
        List<Long> ids = request == null ? List.of() : request.ids();
        return ResponseEntity.ok(getCoursesQuery.findByIds(ids));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Course>> getPopularCourses(
            @RequestParam(defaultValue = "8") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 20));
        return ResponseEntity.ok(getCoursesQuery.findPopular(safeLimit));
    }

    @GetMapping("/teacher/name/{teacherName}")

    public ResponseEntity<List<Course>> getCoursesByTeacherName(@PathVariable String teacherName) {
        List<Course> courses = getCoursesQuery.findByTeacherName(teacherName);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        List<Course> courses = getCoursesQuery.findByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }
    

    @GetMapping("/Department/{departmentName}")
    public ResponseEntity<List<Course>> getCoursesByDepartmentName(@PathVariable String departmentName) {
        List<Course> courses = getCoursesQuery.findByDepartmentName(departmentName);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/testIam/{id}")
    public String testIam(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader){
        String res=iamClient.getStudentBasicRaw(id, authHeader);
        return res;
    }



    private Long resolveDepartmentId(String departmentName) {
        if (departmentName == null || departmentName.isBlank()) {
            throw new IllegalArgumentException("Department name is required");
        }
        List<DepartmentEntity> departments = departmentJpaRepository.findByNameIgnoreCase(departmentName.trim());
        if (departments.isEmpty()) {
            throw new IllegalArgumentException("Department not found: " + departmentName);
        }
        return departments.get(0).getId();
    }

    private Long resolveTeacherId(String userIdHeader, Long userId) {
        Long headerId = parseLong(userIdHeader);
        if (headerId != null) {
            return headerId;
        }
        if (userId != null && userId > 0) {
            return userId;
        }
        throw new IllegalArgumentException("Teacher id is required");
    }

    private Long parseLong(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }


    public record CourseIdsRequest(List<Long> ids) {
    }


}
