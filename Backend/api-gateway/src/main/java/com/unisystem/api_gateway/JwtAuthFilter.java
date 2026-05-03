package com.unisystem.api_gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Value("${jwt.secret}")
    private String secret;

    // Only truly public endpoints — access control for other routes
    // belongs to downstream services, not the gateway
    private static final List<String> PUBLIC = List.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/courses/popular",
        "/api/departments/all",
        "/api/feedbacks/recent"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Allow public endpoints to pass through without a token
        if (PUBLIC.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");

        // Reject if Authorization header is missing or malformed
        if (auth == null || !auth.startsWith("Bearer ")) {
            log.warn("Missing or malformed Authorization header for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            String token = auth.substring(7);

            // Parse and validate the JWT — explicit UTF-8 charset for Docker safety
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Use Object + toString() for type-safe extraction
            // (JWT claims can be String, Integer, Long, List — avoid typed cast failures)
            Object userId = claims.get("userId");
            Object roles  = claims.get("roles");

            // Inject validated claims as headers for downstream services
            ServerHttpRequest mutated = exchange.getRequest().mutate()
                    .header("X-User-Id",  userId != null ? userId.toString() : "")
                    .header("X-Username", claims.getSubject())
                    .header("X-Roles",    roles  != null ? roles.toString()  : "")
                    .build();

            return chain.filter(exchange.mutate().request(mutated).build());

        } catch (JwtException e) {
            // Log the reason for debugging — but never expose it to the client
            log.warn("JWT validation failed for path {}: {}", path, e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    // -1 ensures this filter runs before all other gateway filters
    @Override
    public int getOrder() {
        return -1;
    }
}