package com.yawar.UserService.service;

import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.dto.UserResponse;
import com.yawar.UserService.model.Users;
import org.apache.catalina.User;

public interface UserService {
    public UserResponse registerUser(UserRegisterRequest user);

    public Users getByEmail(String email);
}
