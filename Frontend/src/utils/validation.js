export const requireFields = (payload, fields) => {
  const missing = fields.filter(
    (field) => payload[field] === undefined || payload[field] === ""
  );
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
};
