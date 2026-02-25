package com.yawar.consultant_service.client;

import com.yawar.consultant_service.dto.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @GetMapping("/user/{id}")
    UserProfileDTO getUserById(@PathVariable("id") Long id);
}
