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
public class TeacherProfileResponse {

    private Long teacherId;
    private String role;
    private String name;
    private String email;
    private BigDecimal salary;
    private String department;
    private List<TeacherCourseResponse> courses;
    private List<AnnouncementSummaryResponse> announcements;
    private List<UpcomingEventResponse> upcomingEvents;
    private int coursesCount;
    private int numberOfStudents;
}