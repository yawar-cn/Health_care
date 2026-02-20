package com.yawar.UserService.service.imp;

import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.dto.UserResponse;
import com.yawar.UserService.model.Role;
import com.yawar.UserService.model.Users;
import com.yawar.UserService.repo.UserRepo;
import com.yawar.UserService.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepo repo;

    @Override
    public UserResponse registerUser(UserRegisterRequest request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        Users savedUser = repo.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());

        return response;
    }

    @Override
    public Users getByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
}
