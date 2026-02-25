export const coerceValue = (value, type) => {
  if (value === undefined || value === null || value === "") return undefined;

  switch (type) {
    case "number": {
      const num = Number(value);
      return Number.isNaN(num) ? undefined : num;
    }
    case "list-number": {
      return String(value)
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => !Number.isNaN(item));
    }
    case "list-string": {
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    case "boolean": {
      if (typeof value === "boolean") return value;
      return value === "true" || value === true;
    }
    default:
      return value;
  }
};

export const buildPayloads = (fields, values) => {
  const body = {};
  const query = {};
  const pathParams = {};

  fields.forEach((field) => {
    const raw = values[field.name];
    const parsed = coerceValue(raw, field.type);
    if (parsed === undefined) return;

    if (field.in === "body") {
      body[field.name] = parsed;
    } else if (field.in === "query") {
      query[field.name] = parsed;
    } else if (field.in === "path") {
      pathParams[field.name] = parsed;
    }
  });

  return { body, query, pathParams };
};

export const buildUrl = ({ baseUrl, path, pathParams, query }) => {
  let resolvedPath = path || "";
  Object.entries(pathParams || {}).forEach(([key, value]) => {
    resolvedPath = resolvedPath.replace(
      `{${key}}`,
      encodeURIComponent(String(value))
    );
  });

  const search = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  return `${baseUrl}${resolvedPath}${search.toString() ? `?${search}` : ""}`;
};
