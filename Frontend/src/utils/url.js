export const buildPath = (path, params = {}) => {
  let resolved = path;
  Object.entries(params).forEach(([key, value]) => {
    resolved = resolved.replace(`{${key}}`, encodeURIComponent(String(value)));
  });
  return resolved;
};
