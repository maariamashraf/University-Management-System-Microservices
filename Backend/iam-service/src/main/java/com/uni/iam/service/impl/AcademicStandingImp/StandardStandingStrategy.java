package com.uni.iam.service.impl.AcademicStandingImp;

import com.uni.iam.service.interfaces.AcademicStandingStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class StandardStandingStrategy implements AcademicStandingStrategy {

    @Override
    public String determineStanding(BigDecimal gpa) {
        if (gpa == null) {
            return "Probation";
        }
        if (gpa.compareTo(new BigDecimal("3.5")) >= 0) {
            return "Excellent";
        } else if (gpa.compareTo(new BigDecimal("3.0")) >= 0) {
            return "Good";
        } else if (gpa.compareTo(new BigDecimal("2.0")) >= 0) {
            return "Average";
        } else {
            return "Poor";
        }
    }

    @Override
    public boolean isApplicable(String studentType) {
        return "STANDARD".equalsIgnoreCase(studentType);
    }
}
