package com.yawar.consultant_service.controller;

import com.yawar.consultant_service.dto.CreateDoctorReviewRequest;
import com.yawar.consultant_service.dto.CreateRequestDto;
import com.yawar.consultant_service.dto.DoctorRatingSummaryResponse;
import com.yawar.consultant_service.dto.DoctorReviewResponse;
import com.yawar.consultant_service.dto.PrescriptionRequest;
import com.yawar.consultant_service.model.Consultation;
import com.yawar.consultant_service.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {
    @Autowired
    private ConsultationService service;
    @PostMapping
    public ResponseEntity<Consultation> create(@RequestBody CreateRequestDto req){
        return ResponseEntity.ok(
                service.createConsultation(req));
    }
    @PutMapping("/{id}/accept")
    public ResponseEntity<Consultation> accept(
            @PathVariable String id,
            @RequestParam String doctorId) {

        return ResponseEntity.ok(
                service.acceptConsultation(id, doctorId));
    }
    @PutMapping("/{id}/prescription")
    public ResponseEntity<Consultation> addPrescription(
            @PathVariable String id,
            @RequestBody PrescriptionRequest request) {

        return ResponseEntity.ok(
                service.addPrescription(
                        id,
                        request.getMedicineIds(),
                        request.getPrecautions(),
                        request.getNotes()));
    }
    @PutMapping("/{id}/paid")
    public ResponseEntity<Consultation> markPaid(
            @PathVariable String id) {

        return ResponseEntity.ok(service.markAsPaid(id));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }
    @GetMapping("/pending")
    public ResponseEntity<List<Consultation>> getPendingBySpecialization(
            @RequestParam String specialization,
            @RequestParam(required = false) String doctorId) {
        return ResponseEntity.ok(service.getPendingBySpecialization(specialization, doctorId));
    }
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Consultation>> getByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(service.getByDoctor(doctorId));
    }

    @PostMapping("/doctors/{doctorId}/reviews")
    public ResponseEntity<DoctorReviewResponse> upsertDoctorReview(
            @PathVariable String doctorId,
            @RequestBody CreateDoctorReviewRequest request) {
        return ResponseEntity.ok(service.upsertDoctorReview(doctorId, request));
    }

    @GetMapping("/doctors/{doctorId}/reviews")
    public ResponseEntity<List<DoctorReviewResponse>> getDoctorReviews(@PathVariable String doctorId) {
        return ResponseEntity.ok(service.getDoctorReviews(doctorId));
    }

    @GetMapping("/doctors/{doctorId}/rating")
    public ResponseEntity<DoctorRatingSummaryResponse> getDoctorRatingSummary(
            @PathVariable String doctorId
    ) {
        return ResponseEntity.ok(service.getDoctorRatingSummary(doctorId));
    }

    @GetMapping("/reviews/patient/{patientId}")
    public ResponseEntity<List<DoctorReviewResponse>> getPatientReviews(@PathVariable String patientId) {
        return ResponseEntity.ok(service.getPatientReviews(patientId));
    }
}
