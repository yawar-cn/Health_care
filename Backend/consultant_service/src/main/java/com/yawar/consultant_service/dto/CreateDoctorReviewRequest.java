package com.yawar.consultant_service.dto;

import lombok.Data;

@Data
public class CreateDoctorReviewRequest {
    private String patientId;
    private String consultationId;
    private Integer rating;
    private String review;
}
