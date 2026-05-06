package com.uni.iam.controller;

import com.uni.iam.dto.response.StudentBasicResponse;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.dto.response.TeacherBasicResponse;
import com.uni.iam.service.interfaces.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<StudentProfileResponse> getStudentDetails(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentDetails(id));
    }
    @GetMapping("/basic/{id}")
    public ResponseEntity<StudentBasicResponse> getStudentBasic(@PathVariable Long id) {
        String name=studentService.getStudentName(id);
        StudentBasicResponse response=new StudentBasicResponse(name);
        return ResponseEntity.ok(response);
    }
}
