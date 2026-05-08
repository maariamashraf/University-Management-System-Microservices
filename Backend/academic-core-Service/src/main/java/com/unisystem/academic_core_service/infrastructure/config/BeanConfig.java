package com.unisystem.academic_core_service.infrastructure.config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Mappers.CourseMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

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
    public GetAnnouncementsQuery getAnnouncementsQuery(
            AnnouncementRepositoryPort announcementRepositoryPort,
            EnrollmentRepositoryPort enrollmentRepositoryPort,
            CourseRepositoryPort courseRepositoryPort) {
        return new GetAnnouncementsService(
                announcementRepositoryPort,
                enrollmentRepositoryPort,
                courseRepositoryPort);
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CourseMapper courseMapper() {
        return new CourseMapper();
    }
}
