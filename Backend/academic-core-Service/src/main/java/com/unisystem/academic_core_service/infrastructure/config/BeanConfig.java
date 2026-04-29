package com.unisystem.academic_core_service.infrastructure.config;

import com.unisystem.academic_core_service.domain.application.port.in.CreateAnnouncementUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.CreateCourseUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.EnrollStudentUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.GetAnnouncementsQuery;
import com.unisystem.academic_core_service.domain.application.port.in.GetFeedBackQuery;
import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.application.port.in.GetEnrollmentQuery;
import com.unisystem.academic_core_service.domain.application.port.in.SubmitFeedbackUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.AnnouncementRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;
import com.unisystem.academic_core_service.domain.application.services.CreateAnnouncementService;
import com.unisystem.academic_core_service.domain.application.services.CreateCourseService;
import com.unisystem.academic_core_service.domain.application.services.EnrollStudentService;
import com.unisystem.academic_core_service.domain.application.services.GetAnnouncementsService;
import com.unisystem.academic_core_service.domain.application.services.GetCoursesService;
import com.unisystem.academic_core_service.domain.application.services.GetEnrollmentsService;
import com.unisystem.academic_core_service.domain.application.services.GetFeedbackService;
import com.unisystem.academic_core_service.domain.application.services.SubmitFeedbackService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public CreateCourseUseCase createCourseUseCase(CourseRepositoryPort courseRepository ,EventPublisherPort eventPublisherPort) {
        return new CreateCourseService(courseRepository,eventPublisherPort);
    }

    @Bean
    public GetCoursesQuery getCoursesQuery(CourseRepositoryPort courseRepository) {
        return new GetCoursesService(courseRepository);
    }

    @Bean
    public EnrollStudentUseCase enrollStudentUseCase(CourseRepositoryPort courseRepository, EnrollmentRepositoryPort enrollmentRepository, EventPublisherPort eventPublisher) {
        return new EnrollStudentService(courseRepository, enrollmentRepository, eventPublisher);
    }

    @Bean
    public GetEnrollmentQuery getEnrollmentQuery(EnrollmentRepositoryPort enrollmentRepositoryPort) {
        return new GetEnrollmentsService(enrollmentRepositoryPort);
    }

    @Bean
    public SubmitFeedbackUseCase submitFeedbackUseCase(FeedbackRepsitoryPort feedbackRepsitoryPort) {
        return new SubmitFeedbackService(feedbackRepsitoryPort);
    }

    @Bean
    public GetFeedBackQuery getFeedBackQuery(FeedbackRepsitoryPort feedbackRepsitoryPort) {
        return new GetFeedbackService(feedbackRepsitoryPort);
    }

    @Bean
    public CreateAnnouncementUseCase createAnnouncementUseCase(
            AnnouncementRepositoryPort announcementRepositoryPort,
            CourseRepositoryPort courseRepositoryPort,
            EventPublisherPort eventPublisherPort
    ) {
        return new CreateAnnouncementService(announcementRepositoryPort, courseRepositoryPort, eventPublisherPort);
    }

    @Bean
    public GetAnnouncementsQuery getAnnouncementsQuery(AnnouncementRepositoryPort announcementRepositoryPort) {
        return new GetAnnouncementsService(announcementRepositoryPort);
    }



}
