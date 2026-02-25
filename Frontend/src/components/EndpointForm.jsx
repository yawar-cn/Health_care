import { useMemo, useState } from "react";
import useRequest from "../hooks/useRequest";
import { requestEndpoint } from "../services/apiClient";
import Alert from "./Alert";
import FieldInput from "./FieldInput";
import JsonViewer from "./JsonViewer";
import LoadingIndicator from "./LoadingIndicator";

export default function EndpointForm({ endpoint, service, token, onSuccess }) {
  const initialValues = useMemo(() => {
    const values = {};
    (endpoint.fields || []).forEach((field) => {
      values[field.name] = field.defaultValue ?? "";
    });
    return values;
  }, [endpoint.fields]);

  const [values, setValues] = useState(initialValues);
  const [successMessage, setSuccessMessage] = useState("");
  const actionLabel = endpoint.method === "GET" ? "Fetch" : "Submit";

  const { data, error, status, loading, execute } = useRequest((payload) =>
    requestEndpoint({ endpoint, service, values: payload, token })
  );

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    try {
      const result = await execute(values);
      setSuccessMessage(`Success (${result.status})`);
      if (onSuccess) onSuccess(result.data, result.status, values);
    } catch {
      // handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{endpoint.path}</h3>
          <p className="text-xs text-dusk/70">{endpoint.method}</p>
        </div>
        <span className="tag bg-frost text-dusk">{endpoint.method}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {endpoint.fields?.length ? (
          endpoint.fields.map((field) => (
            <FieldInput
              key={`${endpoint.id}-${field.name}-${field.in}`}
              field={field}
              value={values[field.name]}
              onChange={handleChange}
            />
          ))
        ) : (
          <p className="text-sm text-dusk/70">No fields required.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Sending..." : actionLabel}
        </button>
        {loading ? <LoadingIndicator /> : null}
        {status ? (
          <span className="text-xs text-dusk/70">Status: {status}</span>
        ) : null}
      </div>

      {error ? <Alert type="error" title="Request failed" description={error} /> : null}
      {successMessage ? (
        <Alert type="success" title={successMessage} description="Request completed." />
      ) : null}

      <JsonViewer data={data} />
    </form>
  );
}
