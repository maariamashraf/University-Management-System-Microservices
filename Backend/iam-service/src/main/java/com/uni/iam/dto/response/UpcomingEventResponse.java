package com.uni.iam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingEventResponse {

    private Long id;
    private String title;
    private String description;
    private String date;
    private String type;
}