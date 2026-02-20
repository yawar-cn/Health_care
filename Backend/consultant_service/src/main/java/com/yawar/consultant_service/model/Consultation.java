package com.yawar.consultant_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    private String id;

    private String patientId;
    private String doctorId;

    private String specialization;
    private String description;

    private List<String> medicineIds;

    private String precautions;
    private String doctorNotes;

    private ConsultationStatus status;

    private Double consultationFee;

    private String paymentId;

    private LocalDateTime createdAt;
}
