package com.yawar.consultant_service.repo;

import com.yawar.consultant_service.model.DoctorReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorReviewRepo extends MongoRepository<DoctorReview, String> {
    Optional<DoctorReview> findByConsultationIdAndPatientId(String consultationId, String patientId);
    List<DoctorReview> findByDoctorIdOrderByCreatedAtDesc(String doctorId);
    List<DoctorReview> findByPatientIdOrderByCreatedAtDesc(String patientId);
}
