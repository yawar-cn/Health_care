package com.yawar.consultant_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "doctor_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorReview {

    @Id
    private String id;

    private String doctorId;
    private String patientId;
    private String consultationId;

    private Integer rating;
    private String review;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
