package com.yawar.consultant_service.service.imp;

import com.yawar.consultant_service.client.UserClient;
import com.yawar.consultant_service.dto.CreateDoctorReviewRequest;
import com.yawar.consultant_service.dto.CreateRequestDto;
import com.yawar.consultant_service.dto.DoctorRatingSummaryResponse;
import com.yawar.consultant_service.dto.DoctorReviewResponse;
import com.yawar.consultant_service.dto.UserProfileDTO;
import com.yawar.consultant_service.model.Consultation;
import com.yawar.consultant_service.model.ConsultationStatus;
import com.yawar.consultant_service.model.DoctorReview;
import com.yawar.consultant_service.repo.ConsultationRepo;
import com.yawar.consultant_service.repo.DoctorReviewRepo;
import com.yawar.consultant_service.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.yawar.consultant_service.model.ConsultationStatus.PENDING;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ConsultationSeviceImp implements ConsultationService {
    private static final double DEFAULT_CONSULTATION_FEE = 500.0;
    @Autowired
    private ConsultationRepo repo;
    @Autowired
    private DoctorReviewRepo doctorReviewRepo;
    @Autowired
    private UserClient userClient;
    @Override
    public Consultation createConsultation(CreateRequestDto req) {
        if (req.getDoctorId() == null || req.getDoctorId().isBlank()) {
            throw new RuntimeException("Doctor selection is required");
        }

        Consultation consultation = Consultation.builder()
                .patientId(req.getPatientId())
                .doctorId(req.getDoctorId())
                .specialization(req.getSpecialization())
                .description(req.getDescription())
                .status(PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return repo.save(consultation);
    }

    @Override
    public Consultation acceptConsultation(String id, String doctorId) {
        Consultation consultation = getById(id);

        if (consultation.getDoctorId() != null &&
                !consultation.getDoctorId().isBlank() &&
                !consultation.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Consultation is assigned to another doctor");
        }

        consultation.setDoctorId(doctorId);
        consultation.setStatus(ConsultationStatus.ACCEPTED);
        return repo.save(consultation);
    }

    @Override
    public Consultation addPrescription(String id, List<String> medicineIds, String precautions, String notes) {
        Consultation consultation = getById(id);
        consultation.setMedicineIds(medicineIds);
        consultation.setPrecautions(precautions);
        consultation.setDoctorNotes(notes);
        consultation.setConsultationFee(resolveConsultationFee(consultation.getDoctorId()));
        consultation.setStatus(ConsultationStatus.PAYMENT_PENDING);

        return repo.save(consultation);
    }

    @Override
    public Consultation markAsPaid(String id) {
        Consultation consultation = repo.findById(id)
                .orElseThrow();
        consultation.setStatus(ConsultationStatus.PAID);
        return repo.save(consultation);
    }

    @Override
    public Consultation getById(String id) {
        Consultation consultation = repo.findById(id)
                .orElseThrow();

        if (consultation.getStatus() != ConsultationStatus.PAID &&
                consultation.getStatus() != ConsultationStatus.COMPLETED) {

            consultation.setMedicineIds(null);
            consultation.setDoctorNotes(null);
            consultation.setPrecautions(null);
        }

        return consultation;
    }

    @Override
    public List<Consultation> getByPatient(String patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public List<Consultation> getPendingBySpecialization(String specialization, String doctorId) {
        List<Consultation> pending = new ArrayList<>(
                repo.findBySpecializationAndStatusAndDoctorIdIsNull(specialization, PENDING)
        );
        if (doctorId != null && !doctorId.isBlank()) {
            pending.addAll(
                    repo.findBySpecializationAndStatusAndDoctorId(
                            specialization,
                            PENDING,
                            doctorId
                    )
            );
        }
        return pending;
    }
    @Override
    public List<Consultation> getByDoctor(String doctorId) {
        return repo.findByDoctorId(doctorId);
    }

    @Override
    public DoctorReviewResponse upsertDoctorReview(String doctorId, CreateDoctorReviewRequest request) {
        if (doctorId == null || doctorId.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Doctor id is required");
        }
        if (request == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Review request is required");
        }
        if (request.getPatientId() == null || request.getPatientId().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Patient id is required");
        }
        if (request.getConsultationId() == null || request.getConsultationId().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Consultation id is required");
        }
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new ResponseStatusException(BAD_REQUEST, "Rating must be between 1 and 5");
        }

        Consultation consultation = repo.findById(request.getConsultationId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Consultation not found"));

        if (!request.getPatientId().equals(consultation.getPatientId())) {
            throw new ResponseStatusException(FORBIDDEN, "You can only review your own consultation");
        }
        if (!doctorId.equals(consultation.getDoctorId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Doctor does not match this consultation");
        }

        boolean prescribed = consultation.getStatus() == ConsultationStatus.PAYMENT_PENDING
                || consultation.getStatus() == ConsultationStatus.PAID
                || consultation.getStatus() == ConsultationStatus.COMPLETED;
        if (!prescribed) {
            throw new ResponseStatusException(
                    FORBIDDEN,
                    "Only patients with prescribed consultations can rate and review this doctor"
            );
        }

        DoctorReview review = doctorReviewRepo
                .findByConsultationIdAndPatientId(request.getConsultationId(), request.getPatientId())
                .orElseGet(DoctorReview::new);

        if (review.getId() == null) {
            review.setCreatedAt(LocalDateTime.now());
        }
        review.setUpdatedAt(LocalDateTime.now());
        review.setDoctorId(doctorId);
        review.setPatientId(request.getPatientId());
        review.setConsultationId(request.getConsultationId());
        review.setRating(request.getRating());
        review.setReview(normalizeReview(request.getReview()));

        return toDoctorReviewResponse(doctorReviewRepo.save(review));
    }

    @Override
    public List<DoctorReviewResponse> getDoctorReviews(String doctorId) {
        return doctorReviewRepo.findByDoctorIdOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(this::toDoctorReviewResponse)
                .toList();
    }

    @Override
    public List<DoctorReviewResponse> getPatientReviews(String patientId) {
        return doctorReviewRepo.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::toDoctorReviewResponse)
                .toList();
    }

    @Override
    public DoctorRatingSummaryResponse getDoctorRatingSummary(String doctorId) {
        List<DoctorReview> reviews = doctorReviewRepo.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        long total = reviews.size();
        double average = total == 0
                ? 0.0
                : reviews.stream().mapToInt(DoctorReview::getRating).average().orElse(0.0);

        DoctorRatingSummaryResponse response = new DoctorRatingSummaryResponse();
        response.setDoctorId(doctorId);
        response.setTotalReviews(total);
        response.setAverageRating(roundToSingleDecimal(average));
        return response;
    }

    private DoctorReviewResponse toDoctorReviewResponse(DoctorReview review) {
        DoctorReviewResponse response = new DoctorReviewResponse();
        response.setId(review.getId());
        response.setDoctorId(review.getDoctorId());
        response.setPatientId(review.getPatientId());
        response.setConsultationId(review.getConsultationId());
        response.setRating(review.getRating());
        response.setReview(review.getReview());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }

    private String normalizeReview(String review) {
        if (review == null) {
            return "";
        }
        return review.trim();
    }

    private double roundToSingleDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private Double resolveConsultationFee(String doctorId) {
        if (doctorId == null || doctorId.isBlank()) {
            return DEFAULT_CONSULTATION_FEE;
        }
        Long parsedDoctorId;
        try {
            parsedDoctorId = Long.parseLong(doctorId);
        } catch (NumberFormatException e) {
            return DEFAULT_CONSULTATION_FEE;
        }

        try {
            UserProfileDTO doctorProfile = userClient.getUserById(parsedDoctorId);
            if (doctorProfile == null || doctorProfile.getConsultationFee() == null) {
                return DEFAULT_CONSULTATION_FEE;
            }
            double fee = doctorProfile.getConsultationFee();
            return fee > 0 ? fee : DEFAULT_CONSULTATION_FEE;
        } catch (Exception e) {
            return DEFAULT_CONSULTATION_FEE;
        }
    }
}
