package com.unisystem.academic_core_service.domain.model;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class Course {
    private Long id;
    private String name;
    private String courseCode;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createdAt;
    private int credits;
    private int maxStudents;
    private int enrolledCount;
    private Long departmentId;
    private Long teacherId;

    public Course() {

    }
    public boolean isFull() {
        return enrolledCount >= maxStudents;
    }
    
    public void enrollStudent() {
        if (isFull()) {
            throw new RuntimeException("Course is full");
        }
        enrolledCount++;
    }
    
    public void unenrollStudent() {
        enrolledCount--;
    }


}
