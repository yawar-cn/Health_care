package com.yawar.UserService.dto;

import lombok.Data;

@Data
public class DoctorSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String specialization;
    private Integer experience;
    private Double consultationFee;
    private String photoUrl;
}
