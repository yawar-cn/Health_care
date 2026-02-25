import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import EndpointForm from "../components/EndpointForm";
import PageHeader from "../components/PageHeader";
import { findEndpointById, findServiceById } from "../services/endpoints";

export default function EndpointPage() {
  const { serviceId, endpointId } = useParams();
  const service = useMemo(() => findServiceById(serviceId), [serviceId]);
  const endpoint = useMemo(
    () => findEndpointById(serviceId, endpointId),
    [serviceId, endpointId]
  );
  const [token, setToken] = useState("");

  if (!service || !endpoint) {
    return (
      <Alert
        type="error"
        title="Endpoint not found"
        description="The requested endpoint could not be resolved from the generated backend map."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${service.name} · ${endpoint.method}`}
        subtitle={`Use this form to invoke ${endpoint.path}.`}
        badge={endpoint.id}
      />

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-ink">Bearer Token</h2>
        <input
          className="input"
          placeholder="Paste JWT token if required"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </div>

      <EndpointForm endpoint={endpoint} service={service} token={token} />
    </div>
  );
}
