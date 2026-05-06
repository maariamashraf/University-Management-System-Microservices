package com.uni.iam.controller;
import com.uni.iam.dto.response.TeacherBasicResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.dto.response.TeacherProfileResponse;
import com.uni.iam.service.interfaces.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/basic/{id}")
    public ResponseEntity<TeacherBasicResponse> getTeacherBasic(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherBasic(id));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<TeacherProfileResponse> getTeacherDetails(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherDetails(id));
    }
}
