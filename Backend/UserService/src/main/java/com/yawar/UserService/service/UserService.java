package com.yawar.UserService.service;

import com.yawar.UserService.dto.DoctorFeeUpdateRequest;
import com.yawar.UserService.dto.DoctorSummaryResponse;
import com.yawar.UserService.dto.UserProfileUpdateRequest;
import com.yawar.UserService.dto.UserPhotoUpdateRequest;
import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.dto.UserResponse;
import com.yawar.UserService.model.Users;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponse registerUser(UserRegisterRequest user);

    Users getByEmail(String email);

    UserResponse getById(Long id);

    List<String> getSpecializations();

    List<DoctorSummaryResponse> getDoctors(String specialization);

    UserResponse updateUserPhoto(Long userId, UserPhotoUpdateRequest request);

    UserResponse uploadUserPhoto(Long userId, MultipartFile file);

    Resource loadUserPhoto(String filename);

    UserResponse updateUserProfile(Long userId, UserProfileUpdateRequest request);

    UserResponse updateDoctorConsultationFee(Long userId, DoctorFeeUpdateRequest request);
}
