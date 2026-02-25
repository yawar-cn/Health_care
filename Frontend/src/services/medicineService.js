import { apiRequest } from "./request";
import { getEndpointOrThrow } from "./serviceRegistry";
import { requireFields } from "../utils/validation";
import { buildPath } from "../utils/url";

export const createMedicine = async (payload) => {
  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "MEDICINE-SERVICE",
    method: "POST",
    path: "/medicines"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: payload
  });
};

export const getMedicines = async () => {
  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "MEDICINE-SERVICE",
    method: "GET",
    path: "/medicines"
  });

  return apiRequest({ service, method: endpoint.method, url: endpoint.path });
};

export const getMedicineById = async (id) => {
  requireFields({ id }, ["id"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "MEDICINE-SERVICE",
    method: "GET",
    path: "/medicines/{id}"
  });

  const url = buildPath(endpoint.path, { id });
  return apiRequest({ service, method: endpoint.method, url });
};

export const getMedicinesBulk = async (ids) => {
  requireFields({ ids }, ["ids"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "MEDICINE-SERVICE",
    method: "POST",
    path: "/medicines/bulk"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: ids
  });
};

export const searchMedicines = async (name) => {
  requireFields({ name }, ["name"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "MEDICINE-SERVICE",
    method: "GET",
    path: "/medicines/search"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    params: { name }
  });
};
