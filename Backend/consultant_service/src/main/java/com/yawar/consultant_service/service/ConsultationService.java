package com.yawar.consultant_service.service;

import com.yawar.consultant_service.dto.CreateRequestDto;
import com.yawar.consultant_service.model.Consultation;

import java.util.List;

public interface ConsultationService {

    Consultation createConsultation(CreateRequestDto req);

    Consultation acceptConsultation(String id, String doctorId);

    Consultation addPrescription(String id, List<String> medicineIds, String precautions, String notes);

    Consultation markAsPaid(String id);

    Consultation getById(String id);

    List<Consultation> getByPatient(String patientId);

    List<Consultation> getPendingBySpecialization(String specialization);

    List<Consultation> getByDoctor(String doctorId);
}
