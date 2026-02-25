import { apiRequest } from "./request";
import { getEndpointOrThrow } from "./serviceRegistry";
import { requireFields } from "../utils/validation";
import { buildPath } from "../utils/url";

export const registerUser = async (payload) => {
  requireFields(payload, ["name", "email", "phone", "password", "role"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "POST",
    path: "/user/register"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: payload
  });
};

export const getUserByEmail = async (email) => {
  requireFields({ email }, ["email"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "GET",
    path: "/user/email/{email}"
  });

  const url = buildPath(endpoint.path, { email });
  return apiRequest({
    service,
    method: endpoint.method,
    url
  });
};

export const getSpecializations = async () => {
  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "GET",
    path: "/user/specializations"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path
  });
};

export const getDoctors = async (specialization) => {
  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "GET",
    path: "/user/doctors"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    params: specialization ? { specialization } : {}
  });
};

export const updateUserPhoto = async ({ id, photoUrl }) => {
  requireFields({ id }, ["id"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "PUT",
    path: "/user/{id}/photo"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: { photoUrl: photoUrl ?? "" }
  });
};

export const uploadUserPhotoFile = async ({ id, file }) => {
  requireFields({ id, file }, ["id", "file"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "POST",
    path: "/user/{id}/photo/upload"
  });

  const formData = new FormData();
  formData.append("file", file);
  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: formData
  });
};

export const updateDoctorConsultationFee = async ({ id, consultationFee }) => {
  requireFields({ id, consultationFee }, ["id", "consultationFee"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "PUT",
    path: "/user/{id}/consultation-fee"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: { consultationFee: Number(consultationFee) }
  });
};

export const updateUserProfile = async ({
  id,
  name,
  phone,
  consultationFee
}) => {
  requireFields({ id, name, phone }, ["id", "name", "phone"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "USER-SERVICE",
    method: "PUT",
    path: "/user/{id}/profile"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({
    service,
    method: endpoint.method,
    url,
    data: {
      name,
      phone,
      consultationFee:
        consultationFee === undefined || consultationFee === null
          ? null
          : Number(consultationFee)
    }
  });
};
