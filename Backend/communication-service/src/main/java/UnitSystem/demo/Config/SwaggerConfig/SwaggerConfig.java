package UnitSystem.demo.Config.SwaggerConfig;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Communication Service API")
                        .description("""
                                ## University Microservices System — Person 4 Task
                                
                                **Architecture:** Layered (Controller → Service → Repository → DB)
                                
                                **Design Principles:** SOLID
                                - S: Each class has one responsibility
                                - O: Interfaces allow extension without modification
                                - L: Implementations are substitutable for their interfaces
                                - I: Separate interfaces for Notification and Message
                                - D: Controllers depend on abstractions, not implementations
                                
                                **Kafka Topics Consumed:**
                                - `student-enrolled` → Enrollment confirmation
                                - `announcement-created` → Fan-out to all course students
                                - `course-created` → Logged for future use
                                - `notification-push` → Generic push from any service
                                
                                **WebSocket Topics:**
                                - `/user/{email}/queue/notifications` → personal push
                                - `/topic/course/{courseId}` → course chat broadcast
                                """)
                        .version("1.0.0"))
                .servers(List.of(
                        new Server().url("http://localhost:8083").description("Local Development")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Auth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .tags(List.of(
                        new Tag().name("Notification").description("Notification management — CRUD + WebSocket push"),
                        new Tag().name("Message").description("Course chat — REST + WebSocket broadcast")));
    }
}
