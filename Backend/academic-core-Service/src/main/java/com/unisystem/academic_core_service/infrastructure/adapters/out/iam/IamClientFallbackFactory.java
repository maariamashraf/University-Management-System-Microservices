package com.unisystem.academic_core_service.infrastructure.adapters.out.iam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
public class IamClientFallbackFactory implements FallbackFactory<IamClient> {

    private static final Logger logger = LoggerFactory.getLogger(IamClientFallbackFactory.class);



    @Override
    public IamClient create(Throwable cause) {
        // ✅ Now you see the REAL exception — 401, 404, timeout, etc.
        logger.error("IAM service call failed. cause={}, message={}",
                cause.getClass().getSimpleName(), cause.getMessage());

        return new IamClient() {
            @Override
            public TeacherBasicResponse getTeacherBasic(Long teacherId, String authHeader) {
                logger.warn("Fallback: getTeacherBasic teacherId={}", teacherId);
                return null;
            }

            @Override
            public StudentBasicResponse getStudentBasic(Long studentId, String authHeader) {
                logger.warn("Fallback: getStudentBasic studentId={}", studentId);
                return null;
            }

            @Override
            public String getStudentBasicRaw(Long studentId, String authHeader) {
                logger.warn("Fallback: getStudentBasicRaw studentId={}", studentId);
                return "error";
            }

        };
    }
}