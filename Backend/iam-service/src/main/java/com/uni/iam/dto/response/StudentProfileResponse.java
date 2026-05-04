package com.uni.iam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    private Long id;
    private String role;
    private String username;
    private String email;
    private BigDecimal gpa;
    private Integer totalCredits;
    private List<EnrolledCourseResponse> enrolledCourses;
    private Integer enrolledCoursesCount;
    private Integer enrollmentYear;
    private String academicStanding;
    private List<AnnouncementSummaryResponse> announcements;
    private List<UpcomingEventResponse> upcomingEvents;
}