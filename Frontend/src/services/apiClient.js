import { createHttpClient, normalizeError } from "./httpClient";
import { buildPayloads, buildUrl } from "../utils/request";
import { getServiceBaseUrl } from "./endpoints";

export const requestEndpoint = async ({ endpoint, service, values, token }) => {
  if (!endpoint || !service) {
    throw new Error("Endpoint not found");
  }

  const baseUrl = getServiceBaseUrl(service);
  const client = createHttpClient({ baseUrl, token });

  const { body, query, pathParams } = buildPayloads(endpoint.fields || [], values);
  const url = buildUrl({ baseUrl: "", path: endpoint.path, pathParams, query });

  try {
    const config = {
      method: endpoint.method,
      url
    };

    if (endpoint.method !== "GET" && endpoint.method !== "HEAD") {
      config.data = Object.keys(body).length ? body : undefined;
    }

    const response = await client.request(config);
    return { data: response.data, status: response.status };
  } catch (error) {
    const message = normalizeError(error);
    const status = error?.response?.status || 0;
    throw { message, status, raw: error };
  }
};
