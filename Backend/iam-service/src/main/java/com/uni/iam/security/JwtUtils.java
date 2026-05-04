package com.uni.iam.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    // ─────────────────────────────────────────────
    // Token generation
    // ─────────────────────────────────────────────

    /**
     * Generate a signed JWT after successful authentication.
     * Embeds username + role as claims so downstream services
     * can read them from the X-Roles header injected by the gateway.
     */
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        CustomUserDetails customUserDetails = (CustomUserDetails) userPrincipal;
        // Collect all granted authorities as a list so the JWT carries roles as an array
        java.util.List<String> roles = userPrincipal.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .toList();

        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .claim("roles", roles)
            .claim("userId", customUserDetails.getId())
            .claim("userName", customUserDetails.getUsername())
            .claim("email", customUserDetails.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ─────────────────────────────────────────────
    // Token parsing
    // ─────────────────────────────────────────────

    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    @SuppressWarnings("unchecked")
    public java.util.List<String> getRolesFromToken(String token) {
        Object claim = parseClaims(token).get("roles");
        if (claim instanceof java.util.List) {
            return (java.util.List<String>) claim;
        }
        if (claim instanceof String) {
            return java.util.List.of((String) claim);
        }
        return java.util.Collections.emptyList();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
