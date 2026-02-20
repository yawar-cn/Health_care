package com.yawar.Auth_service.service;

import com.yawar.Auth_service.config.jwt.JwtUtil;
import com.yawar.Auth_service.dto.AuthRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RestTemplate restTemplate;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public String login(AuthRequest request) {

        var user = restTemplate.getForObject(
                "http://USER-SERVICE/user/email/" + request.getEmail(),
                com.yawar.Auth_service.dto.UserDTO.class
        );
        System.out.println(user);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!encoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}

