package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response;

public record CreateCourseResponse(  Long id,
                                     String name,
                                     String courseCode,
                                     int maxStudents,
                                     int enrolledCount,
                                     boolean hasCapacity) {

    public  static CreateCourseResponse from(Long id, String name, String courseCode, int maxStudents, int enrolledCount) {
        boolean hasCapacity = enrolledCount < maxStudents;
        return new CreateCourseResponse(id, name, courseCode, maxStudents, enrolledCount, hasCapacity);
    }
}
