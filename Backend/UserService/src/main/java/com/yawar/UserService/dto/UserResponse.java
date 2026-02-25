package com.yawar.UserService.dto;

import lombok.Data;

@Data
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String specialization;
    private Integer experience;
    private Double consultationFee;
    private String photoUrl;
}
