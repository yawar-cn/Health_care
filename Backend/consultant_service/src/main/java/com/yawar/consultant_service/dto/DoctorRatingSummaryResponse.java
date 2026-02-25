package com.yawar.consultant_service.dto;

import lombok.Data;

@Data
public class DoctorRatingSummaryResponse {
    private String doctorId;
    private Double averageRating;
    private Long totalReviews;
}
