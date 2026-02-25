import { apiRequest } from "./request";
import { getEndpointOrThrow } from "./serviceRegistry";
import { requireFields } from "../utils/validation";

export const login = async ({ email, password }) => {
  requireFields({ email, password }, ["email", "password"]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "AUTH-SERVICE",
    method: "POST",
    path: "/auth/login"
  });

  const data = await apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: { email, password }
  });

  return data;
};
