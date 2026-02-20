package com.yawar.consultant_service.service.imp;

import com.yawar.consultant_service.dto.CreateRequestDto;
import com.yawar.consultant_service.model.Consultation;
import com.yawar.consultant_service.model.ConsultationStatus;
import com.yawar.consultant_service.repo.ConsultationRepo;
import com.yawar.consultant_service.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.yawar.consultant_service.model.ConsultationStatus.PENDING;

@Service
public class ConsultationSeviceImp implements ConsultationService {
    @Autowired
    private ConsultationRepo repo;
    @Override
    public Consultation createConsultation(CreateRequestDto req) {
        Consultation consultation = Consultation.builder()
                .patientId(req.getPatientId())
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
        consultation.setConsultationFee(500.00);
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
    public List<Consultation> getPendingBySpecialization(String specialization) {

        return repo.findBySpecializationAndStatus(specialization,PENDING);
    }
    @Override
    public List<Consultation> getByDoctor(String doctorId) {
        return repo.findByDoctorId(doctorId);
    }
}
