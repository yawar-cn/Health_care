package com.yawar.UserService.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private String role;   // String → convert to Enum inside service
    private String specialization;
    private Integer experience;
    private Double consultationFee;
    private String photoUrl;
}
