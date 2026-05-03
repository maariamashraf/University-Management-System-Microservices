package UnitSystem.demo.Security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security Configuration:
 * - REST API endpoints → open (no JWT needed)
 * - WebSocket (/ws/**) → secured via WebSocketAuthInterceptor
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // REST API — open for all
                    .requestMatchers("/api/**").permitAll()
                    // Swagger — open
                    .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**").permitAll()
                    // Actuator — open
                    .requestMatchers("/actuator/**").permitAll()
                    // WebSocket endpoint — open at HTTP level
                    // (actual auth is handled by WebSocketAuthInterceptor)
                    .requestMatchers("/ws/**").permitAll()
                    .anyRequest().permitAll()
            );
        return http.build();
    }
}
