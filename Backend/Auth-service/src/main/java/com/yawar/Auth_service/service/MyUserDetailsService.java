package com.yawar.Auth_service.service;

import com.yawar.Auth_service.dto.UserDTO;
import com.yawar.Auth_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final RestTemplate restTemplate;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        UserDTO user = restTemplate.getForObject(
                "http://USER-SERVICE/user/email/" + email,
                UserDTO.class
        );

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new UserPrincipal(
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        );
    }
}
