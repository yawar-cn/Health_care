package com.yawar.UserService.service.imp;

import com.yawar.UserService.dto.DoctorFeeUpdateRequest;
import com.yawar.UserService.dto.DoctorSummaryResponse;
import com.yawar.UserService.dto.UserProfileUpdateRequest;
import com.yawar.UserService.dto.UserPhotoUpdateRequest;
import com.yawar.UserService.dto.UserRegisterRequest;
import com.yawar.UserService.dto.UserResponse;
import com.yawar.UserService.model.Role;
import com.yawar.UserService.model.Specialization;
import com.yawar.UserService.model.Users;
import com.yawar.UserService.repo.UserRepo;
import com.yawar.UserService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UserServiceImp implements UserService {
    private static final double DEFAULT_DOCTOR_CONSULTATION_FEE = 500.0;
    private static final long MAX_PHOTO_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final String PHOTO_PATH_PREFIX = "/user/photos/";
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");
    @Autowired
    private UserRepo repo;
    @Value("${app.upload.profile-photo-dir:uploads/profile-photos}")
    private String photoUploadDir;

    @Override
    public UserResponse registerUser(UserRegisterRequest request) {
        Role role = Role.valueOf(request.getRole().trim().toUpperCase(Locale.ROOT));

        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(role);
        user.setPhotoUrl(normalizePhotoUrl(request.getPhotoUrl()));

        if (role == Role.DOCTOR) {
            String specialization = normalizeSpecialization(request.getSpecialization());
            if (specialization == null) {
                throw new IllegalArgumentException("Specialization is required for doctor role");
            }
            user.setSpecialization(specialization);
            user.setExperience(request.getExperience());
            user.setConsultationFee(resolveConsultationFee(request.getConsultationFee()));
        } else {
            user.setSpecialization(null);
            user.setExperience(null);
            user.setConsultationFee(null);
        }

        Users savedUser = repo.save(user);
        return toUserResponse(savedUser);
    }

    @Override
    public Users getByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserResponse getById(Long id) {
        Users user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    @Override
    public List<String> getSpecializations() {
        return Arrays.stream(Specialization.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public List<DoctorSummaryResponse> getDoctors(String specialization) {
        List<Users> doctors;
        if (specialization == null || specialization.isBlank()) {
            doctors = repo.findByRole(Role.DOCTOR);
        } else {
            doctors = repo.findByRoleAndSpecializationIgnoreCase(
                    Role.DOCTOR,
                    normalizeSpecialization(specialization)
            );
        }

        return doctors.stream()
                .map(this::toDoctorSummary)
                .toList();
    }

    @Override
    public UserResponse updateUserPhoto(Long userId, UserPhotoUpdateRequest request) {
        Users user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Path uploadDirectory = resolveUploadDirectory();
        String previousPhotoUrl = user.getPhotoUrl();
        String normalizedPhotoUrl = normalizePhotoUrl(request == null ? null : request.getPhotoUrl());

        // PUT /photo is now used to clear photo (or keep an already stored photo path).
        if (!equalsSafe(previousPhotoUrl, normalizedPhotoUrl)) {
            deleteManagedPhotoIfExists(previousPhotoUrl, uploadDirectory);
        }

        user.setPhotoUrl(normalizedPhotoUrl);
        Users savedUser = repo.save(user);
        return toUserResponse(savedUser);
    }

    @Override
    public UserResponse uploadUserPhoto(Long userId, MultipartFile file) {
        Users user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file.");
        }
        if (file.getSize() > MAX_PHOTO_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Profile photo must be 5 MB or smaller.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }

        String extension = resolveImageExtension(file.getOriginalFilename(), contentType);
        Path uploadDirectory = resolveUploadDirectory();
        String fileName = "user-" + userId + "-" + UUID.randomUUID() + "." + extension;
        Path targetPath = uploadDirectory.resolve(fileName).normalize();
        if (!targetPath.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid photo file path.");
        }

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Unable to store profile photo.");
        }

        deleteManagedPhotoIfExists(user.getPhotoUrl(), uploadDirectory);
        user.setPhotoUrl(PHOTO_PATH_PREFIX + fileName);
        Users savedUser = repo.save(user);
        return toUserResponse(savedUser);
    }

    @Override
    public Resource loadUserPhoto(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        Path uploadDirectory = resolveUploadDirectory();
        Path filePath = uploadDirectory.resolve(safeFilename).normalize();
        if (!filePath.startsWith(uploadDirectory) || !Files.exists(filePath)) {
            throw new ResponseStatusException(NOT_FOUND, "Photo not found");
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(NOT_FOUND, "Photo not found");
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(NOT_FOUND, "Photo not found");
        }
    }

    @Override
    public UserResponse updateUserProfile(Long userId, UserProfileUpdateRequest request) {
        Users user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request == null) {
            throw new IllegalArgumentException("Profile update request is required");
        }

        String name = request.getName() == null ? "" : request.getName().trim();
        String phone = request.getPhone() == null ? "" : request.getPhone().trim();
        if (name.isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (phone.isEmpty()) {
            throw new IllegalArgumentException("Phone is required");
        }

        user.setName(name);
        user.setPhone(phone);

        if (user.getRole() == Role.DOCTOR && request.getConsultationFee() != null) {
            double consultationFee = request.getConsultationFee();
            if (consultationFee <= 0) {
                throw new IllegalArgumentException("Consultation fee must be greater than zero");
            }
            user.setConsultationFee(consultationFee);
        }

        Users savedUser = repo.save(user);
        return toUserResponse(savedUser);
    }

    @Override
    public UserResponse updateDoctorConsultationFee(Long userId, DoctorFeeUpdateRequest request) {
        Users user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.DOCTOR) {
            throw new IllegalArgumentException("Only doctors can update consultation fee");
        }
        if (request == null || request.getConsultationFee() == null) {
            throw new IllegalArgumentException("Consultation fee is required");
        }

        double consultationFee = request.getConsultationFee();
        if (consultationFee <= 0) {
            throw new IllegalArgumentException("Consultation fee must be greater than zero");
        }

        user.setConsultationFee(consultationFee);
        Users savedUser = repo.save(user);
        return toUserResponse(savedUser);
    }

    private UserResponse toUserResponse(Users user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setSpecialization(user.getSpecialization());
        response.setExperience(user.getExperience());
        response.setConsultationFee(user.getConsultationFee());
        response.setPhotoUrl(user.getPhotoUrl());
        return response;
    }

    private DoctorSummaryResponse toDoctorSummary(Users user) {
        DoctorSummaryResponse response = new DoctorSummaryResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setSpecialization(user.getSpecialization());
        response.setExperience(user.getExperience());
        response.setConsultationFee(user.getConsultationFee());
        response.setPhotoUrl(user.getPhotoUrl());
        return response;
    }

    private String normalizeSpecialization(String specialization) {
        if (specialization == null || specialization.isBlank()) {
            return null;
        }
        String normalized = specialization
                .trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase(Locale.ROOT);

        try {
            return Specialization.valueOf(normalized).name();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid specialization: " + specialization);
        }
    }

    private String normalizePhotoUrl(String photoUrl) {
        if (photoUrl == null) {
            return null;
        }
        String trimmed = photoUrl.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (!trimmed.startsWith(PHOTO_PATH_PREFIX)) {
            throw new IllegalArgumentException(
                    "Invalid photo path. Please upload photo using file upload."
            );
        }
        return trimmed;
    }

    private Double resolveConsultationFee(Double consultationFee) {
        if (consultationFee == null) {
            return DEFAULT_DOCTOR_CONSULTATION_FEE;
        }
        if (consultationFee <= 0) {
            throw new IllegalArgumentException("Consultation fee must be greater than zero");
        }
        return consultationFee;
    }

    private Path resolveUploadDirectory() {
        Path uploadDirectory = Paths.get(photoUploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Unable to initialize profile photo storage.");
        }
        return uploadDirectory;
    }

    private void deleteManagedPhotoIfExists(String photoUrl, Path uploadDirectory) {
        if (photoUrl == null || !photoUrl.startsWith(PHOTO_PATH_PREFIX)) {
            return;
        }

        String filename = photoUrl.substring(PHOTO_PATH_PREFIX.length());
        if (filename.isBlank()) {
            return;
        }

        Path target = uploadDirectory.resolve(Paths.get(filename).getFileName().toString())
                .normalize();
        if (!target.startsWith(uploadDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Ignore deletion failures to avoid blocking profile updates.
        }
    }

    private String resolveImageExtension(String originalFilename, String contentType) {
        String extension = null;
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1)
                    .trim()
                    .toLowerCase(Locale.ROOT);
        }

        if (extension != null && ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            return extension;
        }

        String fromContentType = guessExtensionFromContentType(contentType);
        if (fromContentType != null) {
            return fromContentType;
        }

        throw new IllegalArgumentException("Allowed image types: jpg, jpeg, png, webp.");
    }

    private String guessExtensionFromContentType(String contentType) {
        if (contentType == null) {
            return null;
        }
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> null;
        };
    }

    private boolean equalsSafe(String value1, String value2) {
        if (value1 == null && value2 == null) {
            return true;
        }
        if (value1 == null || value2 == null) {
            return false;
        }
        return value1.equals(value2);
    }

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
}
