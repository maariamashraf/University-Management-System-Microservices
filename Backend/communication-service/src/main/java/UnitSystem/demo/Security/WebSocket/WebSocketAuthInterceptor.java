package UnitSystem.demo.Security.WebSocket;

import UnitSystem.demo.Security.jwt.JwtService;  // ← add this


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * WebSocket Security:
 * Validates JWT token when a client connects via WebSocket.
 * If token is valid → connection allowed.
 * If token is missing or invalid → connection rejected.
 *
 * REST API endpoints are NOT affected by this interceptor.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("❌ WebSocket connection rejected — no JWT token provided");
                throw new IllegalArgumentException("WebSocket requires a valid JWT token");
            }

            try {
                String token = authHeader.substring(7);
                String username = jwtService.extractUsername(token);

                if (username != null && jwtService.isTokenValid(token)) {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(username, null, null);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    accessor.setUser(auth);
                    log.info("✅ WebSocket authenticated: {}", username);
                } else {
                    log.warn("❌ WebSocket connection rejected — invalid JWT token");
                    throw new IllegalArgumentException("Invalid JWT token");
                }
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                log.warn("❌ WebSocket JWT validation failed: {}", e.getMessage());
                throw new IllegalArgumentException("WebSocket JWT validation failed: " + e.getMessage());
            }
        }

        return message;
    }
}
