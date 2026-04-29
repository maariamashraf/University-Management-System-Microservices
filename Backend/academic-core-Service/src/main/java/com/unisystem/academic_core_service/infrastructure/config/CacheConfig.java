package com.unisystem.academic_core_service.infrastructure.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    public static final String ANNOUNCEMENTS_BY_COURSE_CACHE = "announcementsByCourse";
    public static final String COURSES_ALL_CACHE = "coursesAll";
    public static final String COURSES_BY_ID_CACHE = "coursesById";
    public static final String COURSES_BY_TEACHER_NAME_CACHE = "coursesByTeacherName";
    public static final String COURSES_BY_TEACHER_ID_CACHE = "coursesByTeacherId";
    public static final String COURSES_BY_NAME_CACHE = "coursesByName";
    public static final String COURSES_BY_DEPARTMENT_CACHE = "coursesByDepartment";
    public static final String COURSES_POPULAR_CACHE = "coursesPopular";
    public static final String ENROLLMENTS_BY_STUDENT_CACHE = "enrollmentsByStudent";
    public static final String ENROLLMENTS_BY_COURSE_CACHE = "enrollmentsByCourse";
    public static final String ENROLLMENT_BY_STUDENT_COURSE_CACHE = "enrollmentByStudentCourse";
    public static final String ENROLLMENTS_ALL_CACHE = "enrollmentsAll";
    public static final String FEEDBACK_BY_COURSE_CACHE = "feedbackByCourse";
    public static final String FEEDBACK_BY_USER_CACHE = "feedbackByUser";
    public static final String FEEDBACK_BY_ID_CACHE = "feedbackById";
    public static final String FEEDBACK_ALL_CACHE = "feedbackAll";

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                ANNOUNCEMENTS_BY_COURSE_CACHE,
                COURSES_ALL_CACHE,
                COURSES_BY_ID_CACHE,
                COURSES_BY_TEACHER_NAME_CACHE,
                COURSES_BY_TEACHER_ID_CACHE,
                COURSES_BY_NAME_CACHE,
                COURSES_BY_DEPARTMENT_CACHE,
                COURSES_POPULAR_CACHE,
                ENROLLMENTS_BY_STUDENT_CACHE,
                ENROLLMENTS_BY_COURSE_CACHE,
                ENROLLMENT_BY_STUDENT_COURSE_CACHE,
                ENROLLMENTS_ALL_CACHE,
                FEEDBACK_BY_COURSE_CACHE,
                FEEDBACK_BY_USER_CACHE,
                FEEDBACK_BY_ID_CACHE,
                FEEDBACK_ALL_CACHE
        );
    }
}
