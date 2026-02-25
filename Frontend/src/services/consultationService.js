import { apiRequest } from "./request";
import { getEndpointOrThrow } from "./serviceRegistry";
import { requireFields } from "../utils/validation";
import { buildPath } from "../utils/url";

export const createConsultation = async ({
  patientId,
  doctorId,
  specialization,
  description
}) => {
  requireFields({ patientId, doctorId, specialization, description }, [
    "patientId",
    "doctorId",
    "specialization",
    "description"
  ]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "POST",
    path: "/consultations"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: { patientId, doctorId, specialization, description }
  });
};

export const acceptConsultation = async ({ id, doctorId }) => {
  requireFields({ id, doctorId }, ["id", "doctorId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "PUT",
    path: "/consultations/{id}/accept"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    params: { doctorId }
  });
};

export const addPrescription = async ({ id, medicineIds, precautions, notes }) => {
  requireFields({ id }, ["id"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "PUT",
    path: "/consultations/{id}/prescription"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: {
      medicineIds,
      precautions,
      notes
    }
  });
};

export const markConsultationPaid = async ({ id }) => {
  requireFields({ id }, ["id"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "PUT",
    path: "/consultations/{id}/paid"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url
  });
};

export const getConsultationById = async (id) => {
  requireFields({ id }, ["id"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/{id}"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({ service, method: endpoint.method, url });
};

export const getConsultationsByPatient = async (patientId) => {
  requireFields({ patientId }, ["patientId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/patient/{patientId}"
  });

  const url = buildPath(endpoint.path, { patientId });
  return apiRequest({ service, method: endpoint.method, url });
};

export const getConsultationsByDoctor = async (doctorId) => {
  requireFields({ doctorId }, ["doctorId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/doctor/{doctorId}"
  });

  const url = buildPath(endpoint.path, { doctorId });
  return apiRequest({ service, method: endpoint.method, url });
};

export const getPendingConsultations = async (specialization, doctorId) => {
  requireFields({ specialization }, ["specialization"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/pending"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    params: {
      specialization,
      ...(doctorId ? { doctorId } : {})
    }
  });
};

export const upsertDoctorReview = async ({
  doctorId,
  patientId,
  consultationId,
  rating,
  review
}) => {
  requireFields({ doctorId, patientId, consultationId, rating }, [
    "doctorId",
    "patientId",
    "consultationId",
    "rating"
  ]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "POST",
    path: "/consultations/doctors/{doctorId}/reviews"
  });

  const url = buildPath(endpoint.path, { doctorId });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: {
      patientId,
      consultationId,
      rating: Number(rating),
      review: review || ""
    }
  });
};

export const getDoctorReviews = async (doctorId) => {
  requireFields({ doctorId }, ["doctorId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/doctors/{doctorId}/reviews"
  });

  const url = buildPath(endpoint.path, { doctorId });
  return apiRequest({
    service,
    method: endpoint.method,
    url
  });
};

export const getDoctorRatingSummary = async (doctorId) => {
  requireFields({ doctorId }, ["doctorId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/doctors/{doctorId}/rating"
  });

  const url = buildPath(endpoint.path, { doctorId });
  return apiRequest({
    service,
    method: endpoint.method,
    url
  });
};

export const getPatientReviews = async (patientId) => {
  requireFields({ patientId }, ["patientId"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "CONSULTANT-SERVICE",
    method: "GET",
    path: "/consultations/reviews/patient/{patientId}"
  });

  const url = buildPath(endpoint.path, { patientId });
  return apiRequest({
    service,
    method: endpoint.method,
    url
  });
};
