package com.uni.iam.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * AOP LAYER — Cross-cutting concerns for the service layer.
 *
 * Applies to every public method in com.uni.iam.service.* :
 *
 *  @Before         — logs method name and arguments before execution
 *  @AfterReturning — logs the return type on success
 *  @AfterThrowing  — logs exception details on failure
 *  @Around         — measures and logs total execution time
 *
 * This keeps logging completely out of business logic classes.
 */
@Slf4j
@Aspect
@Component
public class LoggingAspect {

    /**
     * Pointcut: every public method inside any class
     * in the com.uni.iam.service package (or sub-packages).
     */
    @Pointcut("execution(public * com.uni.iam.service..*(..))")
    public void serviceLayer() {}

    // ─────────────────────────────────────────────
    // @AfterReturning — log successful return
    // ─────────────────────────────────────────────

    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logMethodSuccess(JoinPoint jp, Object result) {
        String method = jp.getSignature().toShortString();
        String returnInfo = (result != null)
                ? result.getClass().getSimpleName()
                : "void";
        log.info("[AOP] ✔ Returned from: {} | return type: {}", method, returnInfo);
    }

    // ─────────────────────────────────────────────
    // @AfterThrowing — log exceptions
    // ─────────────────────────────────────────────

    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logMethodException(JoinPoint jp, Throwable ex) {
        String method = jp.getSignature().toShortString();
        log.error("[AOP] ✘ Exception in: {} | {}: {}",
                method, ex.getClass().getSimpleName(), ex.getMessage());
    }

    // ─────────────────────────────────────────────
    // @Around — measure execution time
    // ─────────────────────────────────────────────

    @Around("serviceLayer()")
    public Object logExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        String method = pjp.getSignature().toShortString();
        long start = System.currentTimeMillis();
        try {
            Object result = pjp.proceed();
            long elapsed = System.currentTimeMillis() - start;
            log.info("[AOP] ⏱ {} completed in {} ms", method, elapsed);
            return result;
        } catch (Throwable ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.warn("[AOP] ⏱ {} failed after {} ms", method, elapsed);
            throw ex;
        }
    }
}
