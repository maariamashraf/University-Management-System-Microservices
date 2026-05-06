package com.uni.iam.bootstrap;

import com.uni.iam.entity.Admin;
import com.uni.iam.entity.Role;
import com.uni.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin user when missing. Idempotent across restarts.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class AdminDatabaseSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${iam.seed.admin.enabled:true}")
    private boolean enabled;

    @Value("${iam.seed.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${iam.seed.admin.password:test1234}")
    private String adminPassword;

    @Value("${iam.seed.admin.username:admin}")
    private String adminUsername;

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            log.debug("IAM admin seed skipped (iam.seed.admin.enabled=false).");
            return;
        }

        String email = adminEmail.trim();
        String username = adminUsername.trim();

        if (userRepository.existsByEmail(email)) {
            log.info("IAM admin seed skipped: user with email '{}' already exists.", email);
            return;
        }

        if (userRepository.existsByUsername(username)) {
            log.warn("IAM admin seed skipped: username '{}' is already taken (email free). Assign manually.", username);
            return;
        }

        Admin admin = Admin.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .active(true)
                .build();

        userRepository.save(admin);

        log.info("IAM admin seed created: username='{}', email='{}'.", username, email);
    }
}
