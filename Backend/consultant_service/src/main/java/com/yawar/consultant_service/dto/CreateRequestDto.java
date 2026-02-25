package com.yawar.consultant_service.dto;

import lombok.Data;

@Data
public class CreateRequestDto {
    private String patientId;
    private String doctorId;
    private String specialization;
    private String description;
}
