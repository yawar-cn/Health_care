package com.yawar.consultant_service.repo;

import com.yawar.consultant_service.model.Consultation;
import com.yawar.consultant_service.model.ConsultationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationRepo extends MongoRepository<Consultation, String> {

    List<Consultation> findBySpecializationAndStatus(
            String specialization,
            ConsultationStatus status);

    List<Consultation> findByPatientId(String patientId);
    List<Consultation> findByDoctorId(String doctorId);

    Consultation getById(String id);
}
