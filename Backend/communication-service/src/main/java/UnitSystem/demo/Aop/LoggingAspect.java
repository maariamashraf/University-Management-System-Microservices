package UnitSystem.demo.Aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * AOP — Aspect-Oriented Programming
 *
 * Cross-cutting concerns handled in ONE place:
 *   1. Logging — logs every service method call automatically
 *   2. Performance — measures execution time of every method
 *   3. Exception Logging — logs all exceptions with full details
 *
 * SOLID — Single Responsibility:
 *   Services no longer need log.info() calls everywhere.
 *   This class owns ALL logging concerns for the service layer.
 *
 * SOLID — Open/Closed:
 *   New services are automatically covered without any changes here.
 *   Just add a new class in ImpServiceLayer and AOP covers it.
 */
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // ── Pointcut definitions ──────────────────────────────

    @Pointcut("execution(* UnitSystem.demo.BusinessLogic.ImpServiceLayer.*.*(..))")
    public void serviceLayer() {}

    @Pointcut("execution(* UnitSystem.demo.Controllers.*.*(..))")
    public void controllerLayer() {}

    @Pointcut("execution(* UnitSystem.demo.DataAccessLayer.Repositories.*.*(..))")
    public void repositoryLayer() {}

    @Pointcut("execution(* UnitSystem.demo.Kafka.*.*(..))")
    public void kafkaLayer() {}

    // ── 1. LOG BEFORE — logs method entry ────────────────

    @Before("serviceLayer()")
    public void logServiceMethodEntry(JoinPoint joinPoint) {
        log.info("▶ [SERVICE] Calling: {}.{}()",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    @Before("controllerLayer()")
    public void logControllerMethodEntry(JoinPoint joinPoint) {
        log.info("▶ [CONTROLLER] Request received: {}.{}()",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    @Before("kafkaLayer()")
    public void logKafkaMethodEntry(JoinPoint joinPoint) {
        log.info("▶ [KAFKA] Event received by: {}.{}()",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    // ── 2. LOG AFTER RETURNING — logs successful result ──

    @AfterReturning(
            pointcut = "serviceLayer()",
            returning = "result")
    public void logServiceMethodSuccess(JoinPoint joinPoint, Object result) {
        log.info("✅ [SERVICE] Completed: {}.{}()",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    @AfterReturning(
            pointcut = "controllerLayer()",
            returning = "result")
    public void logControllerMethodSuccess(JoinPoint joinPoint, Object result) {
        log.info("✅ [CONTROLLER] Response sent: {}.{}()",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    // ── 3. LOG EXCEPTION — logs all errors in one place ──

    @AfterThrowing(
            pointcut = "serviceLayer()",
            throwing = "exception")
    public void logServiceException(JoinPoint joinPoint, Exception exception) {
        log.error("❌ [SERVICE] Exception in: {}.{}() — Message: {}",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName(),
                exception.getMessage());
    }

    @AfterThrowing(
            pointcut = "repositoryLayer()",
            throwing = "exception")
    public void logRepositoryException(JoinPoint joinPoint, Exception exception) {
        log.error("❌ [REPOSITORY] DB error in: {}.{}() — Message: {}",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName(),
                exception.getMessage());
    }

    @AfterThrowing(
            pointcut = "kafkaLayer()",
            throwing = "exception")
    public void logKafkaException(JoinPoint joinPoint, Exception exception) {
        log.error("❌ [KAFKA] Error in: {}.{}() — Message: {}",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName(),
                exception.getMessage());
    }

    // ── 4. PERFORMANCE — measures execution time ──────────

    @Around("serviceLayer()")
    public Object measureServiceExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long duration = System.currentTimeMillis() - startTime;

        if (duration > 1000) {
            log.warn("⚠️  [PERFORMANCE] SLOW method: {}.{}() took {} ms",
                    joinPoint.getTarget().getClass().getSimpleName(),
                    joinPoint.getSignature().getName(),
                    duration);
        } else {
            log.info("⏱  [PERFORMANCE] {}.{}() executed in {} ms",
                    joinPoint.getTarget().getClass().getSimpleName(),
                    joinPoint.getSignature().getName(),
                    duration);
        }

        return result;
    }
}
