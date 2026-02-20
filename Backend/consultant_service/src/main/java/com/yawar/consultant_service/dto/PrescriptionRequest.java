package com.yawar.consultant_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class PrescriptionRequest {
    private List<String> medicineIds;
    private String precautions;
    private String notes;
    private Double totalAmount;
}
