package com.yawar.consultant_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DoctorReviewResponse {
    private String id;
    private String doctorId;
    private String patientId;
    private String consultationId;
    private Integer rating;
    private String review;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
