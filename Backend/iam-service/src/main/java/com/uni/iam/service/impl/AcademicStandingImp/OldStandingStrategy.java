package com.uni.iam.service.impl.AcademicStandingImp;

import com.uni.iam.service.interfaces.AcademicStandingStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class OldStandingStrategy implements AcademicStandingStrategy {

    @Override
    public String determineStanding(BigDecimal gpa) {
        if (gpa == null) {
            return "Probation";
        }
        if (gpa.compareTo(new java.math.BigDecimal("3.0")) >= 0) {
            return "Good Standing";
        } else {
            return "Probation";
        }
    }

    @Override
    public boolean isApplicable(String studentType) {
        return "OLD".equalsIgnoreCase(studentType);
    }

}
