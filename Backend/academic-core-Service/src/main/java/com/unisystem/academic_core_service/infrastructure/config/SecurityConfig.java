package com.unisystem.academic_core_service.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                    .requestMatchers("api/courses/popular").permitAll()
                    .requestMatchers("api/departments/all").permitAll()
                    .requestMatchers("api/feedbacks/recent").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
