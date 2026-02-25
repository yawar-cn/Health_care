package com.yawar.Auth_service.controller;

import com.yawar.Auth_service.dto.AuthRequest;
import com.yawar.Auth_service.dto.AuthResponse;
import com.yawar.Auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return service.login(request);
    }
}
