package com.yawar.Auth_service.dto;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String role;
    private String specialization;
    private Integer experience;
    private Double consultationFee;
    private String photoUrl;
}
