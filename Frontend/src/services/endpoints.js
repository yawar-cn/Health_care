import generated from "../data/endpoints.generated.json";

const envMapping = {
  "AUTH-SERVICE": import.meta.env.VITE_AUTH_SERVICE_URL,
  "USER-SERVICE": import.meta.env.VITE_USER_SERVICE_URL,
  "CONSULTANT-SERVICE": import.meta.env.VITE_CONSULTATION_SERVICE_URL,
  "CONSULTATION-SERVICE": import.meta.env.VITE_CONSULTATION_SERVICE_URL,
  "MEDICINE-SERVICE": import.meta.env.VITE_MEDICINE_SERVICE_URL,
  "PAYMENT-SERVICE": import.meta.env.VITE_PAYMENT_SERVICE_URL
};

export const services = generated.services || [];

const resolveOverride = (serviceName) => {
  if (!serviceName) return null;
  const normalized = serviceName.toUpperCase();
  return envMapping[normalized] || null;
};

export const getServiceBaseUrl = (service) => {
  if (!service) return "";
  if (import.meta.env.VITE_USE_PROXY === "true") return "";
  const gateway = import.meta.env.VITE_API_GATEWAY_URL;
  if (gateway) return gateway;
  const override = resolveOverride(service.name);
  if (override) return override;
  if (service.baseUrl) return service.baseUrl;
  return "";
};

export const findService = (predicate) => services.find(predicate);

export const findServiceByName = (serviceName) =>
  services.find(
    (service) => service.name.toUpperCase() === serviceName.toUpperCase()
  );

export const findEndpointBySignature = ({ serviceName, method, path }) => {
  const service = findServiceByName(serviceName);
  if (!service) return null;
  return (
    service.endpoints.find(
      (endpoint) =>
        endpoint.method === method.toUpperCase() && endpoint.path === path
    ) || null
  );
};
