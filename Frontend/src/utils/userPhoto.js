import { findServiceByName, getServiceBaseUrl } from "../services/endpoints";

const userService = findServiceByName("USER-SERVICE");
const userServiceBaseUrl = getServiceBaseUrl(userService);

export const resolveUserPhotoUrl = (photoUrl) => {
  if (!photoUrl) {
    return "";
  }

  const value = String(photoUrl).trim();
  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${userServiceBaseUrl}${normalized}`;
};
