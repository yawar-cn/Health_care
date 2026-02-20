package com.yawar.UserService.controller;

import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.model.Users;
import com.yawar.UserService.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterRequest user){
        return new ResponseEntity<>(service.registerUser(user),HttpStatus.OK);
    }
    @GetMapping("/email/{email}")
    public Users getUserByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }

}
