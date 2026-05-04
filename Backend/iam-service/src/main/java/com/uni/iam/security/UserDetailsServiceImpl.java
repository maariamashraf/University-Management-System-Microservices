package com.uni.iam.security;

import com.uni.iam.entity.User;
import com.uni.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SECURITY LAYER
 * Bridges Spring Security's authentication mechanism with our UserRepository.
 * Called by the AuthenticationManager when a login attempt is made.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Holds current authenticated user id per request thread.
     */
    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();
    public Long getCurrentUserId() {
        return currentUserId.get();
    }
    public void clearCurrentUserId() {
        currentUserId.remove();
    }
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username));

        currentUserId.set(user.getId());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }



}
