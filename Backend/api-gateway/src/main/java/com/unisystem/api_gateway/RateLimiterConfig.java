package com.unisystem.api_gateway;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    /**
     * Rate-limit by IP address.
     * Falls back to "anonymous" if the remote address is unavailable
     * so the limiter never gets a null key (which causes it to deny all requests).
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            var addr = exchange.getRequest().getRemoteAddress();
            String key = (addr != null)
                    ? addr.getAddress().getHostAddress()
                    : "anonymous";
            return Mono.just(key);
        };
    }
}
