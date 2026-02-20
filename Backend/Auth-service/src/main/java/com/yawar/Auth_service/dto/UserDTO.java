package com.yawar.Auth_service.dto;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String email;
    private String password;
    private String role;
}

