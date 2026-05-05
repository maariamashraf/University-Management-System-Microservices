package com.unisystem.academic_core_service.infrastructure.config;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.Set;

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
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory, ObjectMapper objectMapper) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer(objectMapper)
                        )
                );

        Set<String> cacheNames = Set.of(
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

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .initialCacheNames(cacheNames)
                .build();
    }
}
