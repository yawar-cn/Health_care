import { useMemo, useState } from "react";
import { buildBody } from "../utils/endpoint";

const METHOD_STYLES = {
  GET: "bg-sky/40 text-slateblue",
  POST: "bg-tide/30 text-ink",
  PUT: "bg-coral/25 text-ink",
  DELETE: "bg-rose-200 text-rose-700"
};

export default function EndpointCard({ endpoint, baseUrl, token }) {
  const {
    title,
    method,
    path,
    description,
    fields = [],
    hint,
    customBody
  } = endpoint;

  const initialValues = useMemo(() => {
    const state = {};
    fields.forEach((field) => {
      state[field.key] = field.defaultValue ?? "";
    });
    return state;
  }, [fields]);

  const [values, setValues] = useState(initialValues);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);
    const start = performance.now();

    try {
      let resolvedPath = path;
      fields
        .filter((field) => field.in === "path")
        .forEach((field) => {
          const raw = values[field.key] ?? "";
          resolvedPath = resolvedPath.replace(
            `{${field.key}}`,
            encodeURIComponent(raw)
          );
        });

      const query = new URLSearchParams();
      fields
        .filter((field) => field.in === "query")
        .forEach((field) => {
          const raw = values[field.key];
          if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
            query.set(field.key, raw);
          }
        });

      const url = `${baseUrl}${resolvedPath}${
        query.toString() ? `?${query.toString()}` : ""
      }`;

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = { method, headers };

      if (method !== "GET" && method !== "HEAD") {
        const body = customBody ? customBody(values) : buildBody(values, fields);
        if (body !== undefined) {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const res = await fetch(url, options);
      const text = await res.text();
      let data = text;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      setResponse(data);
      setStatus(res.status);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLatency(Math.round(performance.now() - start));
      setLoading(false);
    }
  };

  return (
    <div className="section-card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`tag ${
                METHOD_STYLES[method] || "bg-mist text-slateblue"
              }`}
            >
              {method}
            </span>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
          </div>
          {description ? (
            <p className="mt-2 text-sm text-slateblue/80">{description}</p>
          ) : null}
        </div>
        {hint ? (
          <div className="rounded-2xl border border-tide/30 bg-tide/10 px-4 py-2 text-xs text-slateblue">
            {hint}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-slateblue">
              {field.label}
            </label>
            {field.control === "textarea" ? (
              <textarea
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => onChange(field.key, event.target.value)}
                rows={4}
                className="input resize-none"
              />
            ) : field.control === "select" ? (
              <select
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="input"
              >
                <option value="">Select option</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.control || "text"}
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="input"
              />
            )}
            {field.helper ? (
              <p className="text-xs text-slateblue/70">{field.helper}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="button" onClick={sendRequest} disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </button>
        <div className="text-xs text-slateblue/70">
          {path}
          {status ? ` · ${status}` : ""}
          {latency ? ` · ${latency} ms` : ""}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-slateblue">
          Response
        </div>
        {error ? (
          <pre className="mt-3 whitespace-pre-wrap text-sm text-rose-600">
            {error}
          </pre>
        ) : (
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-sm text-ink">
            {response ? JSON.stringify(response, null, 2) : "No response yet"}
          </pre>
        )}
      </div>
    </div>
  );
}
