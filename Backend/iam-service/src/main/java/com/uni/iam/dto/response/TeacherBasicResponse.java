package com.uni.iam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherBasicResponse {

    private Long id;
    private String teacherName;
    private String officeLocation;
}
