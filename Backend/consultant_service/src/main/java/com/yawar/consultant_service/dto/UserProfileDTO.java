package com.yawar.consultant_service.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String role;
    private Double consultationFee;
}
