package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.CreateCourseUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.AuditLog;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.TeachersOnly;
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

    @TeachersOnly
    @AuditLog(action = "CREATE_COURSE")
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody CreateCourseUseCase.CreateCourseCommand command) {
        Course course = createCourseUseCase.create(command);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
         Course course=getCoursesQuery.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return ResponseEntity.ok(course);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = getCoursesQuery.findAll();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/teacher/{teacherName}")
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
}
