package com.yawar.UserService.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String name;
    private String phone;
    private Double consultationFee;
}
