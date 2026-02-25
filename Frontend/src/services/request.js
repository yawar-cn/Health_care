import { createHttpClient } from "./httpClient";
import { getServiceBaseUrl } from "./endpoints";

export const apiRequest = async ({ service, method, url, data, params }) => {
  if (!service) {
    throw new Error("Service not found");
  }

  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  const baseUrl = getServiceBaseUrl(service) || "";
  if (!baseUrl && !useProxy) {
    throw new Error("Base URL not configured for service");
  }

  const client = createHttpClient(baseUrl);
  const response = await client.request({
    method,
    url,
    data,
    params
  });

  return response.data;
};
