package com.uni.iam.security;

import com.uni.iam.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class CustomUserDetails extends org.springframework.security.core.userdetails.User {

    private final Long id;
    private final String email;

    public CustomUserDetails(Long id,
                             String username,
                             String email,
                             String password,
                             boolean active,
                             Collection<? extends GrantedAuthority> authorities) {

        // Passing 'active' to the 'enabled' parameter of Spring's User class
        // The other true values are for: accountNonExpired, credentialsNonExpired, accountNonLocked
        super(username, password, active, true, true, true, authorities);

        this.id = id;
        this.email = email;
    }
}