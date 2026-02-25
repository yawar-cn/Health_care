package com.yawar.Auth_service.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    private String token;
    private UserDTO user;
}
