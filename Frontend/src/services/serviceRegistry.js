import { findEndpointBySignature, findServiceByName } from "./endpoints";

export const getEndpointOrThrow = ({ serviceName, method, path }) => {
  const service = findServiceByName(serviceName);
  if (!service) {
    throw new Error(`Service not found: ${serviceName}`);
  }

  const endpoint = findEndpointBySignature({ serviceName, method, path });
  if (!endpoint) {
    throw new Error(`Endpoint missing: ${method} ${path}`);
  }

  return { service, endpoint };
};
