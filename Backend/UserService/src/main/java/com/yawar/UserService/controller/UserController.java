package com.yawar.UserService.controller;

import com.yawar.UserService.dto.DoctorFeeUpdateRequest;
import com.yawar.UserService.dto.UserProfileUpdateRequest;
import com.yawar.UserService.dto.UserPhotoUpdateRequest;
import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.model.Users;
import com.yawar.UserService.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/specializations")
    public List<String> getSpecializations() {
        return service.getSpecializations();
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String specialization
    ) {
        return ResponseEntity.ok(service.getDoctors(specialization));
    }

    @PutMapping("/{id}/photo")
    public ResponseEntity<?> updateUserPhoto(
            @PathVariable Long id,
            @RequestBody UserPhotoUpdateRequest request
    ) {
        return ResponseEntity.ok(service.updateUserPhoto(id, request));
    }

    @PostMapping(value = "/{id}/photo/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadUserPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(service.uploadUserPhoto(id, file));
    }

    @GetMapping("/photos/{filename:.+}")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable String filename) {
        Resource resource = service.loadUserPhoto(filename);
        MediaType mediaType = MediaTypeFactory.getMediaType(resource)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UserProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(service.updateUserProfile(id, request));
    }

    @PutMapping("/{id}/consultation-fee")
    public ResponseEntity<?> updateDoctorConsultationFee(
            @PathVariable Long id,
            @RequestBody DoctorFeeUpdateRequest request
    ) {
        return ResponseEntity.ok(service.updateDoctorConsultationFee(id, request));
    }

}
