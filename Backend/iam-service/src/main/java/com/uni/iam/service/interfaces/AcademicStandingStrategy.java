package com.uni.iam.service.interfaces;

import java.math.BigDecimal;

public interface AcademicStandingStrategy {

    String determineStanding(BigDecimal gpa);
    boolean isApplicable(String studentType);
}
