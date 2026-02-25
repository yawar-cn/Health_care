import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import EndpointForm from "../components/EndpointForm";
import JsonViewer from "../components/JsonViewer";
import PageHeader from "../components/PageHeader";
import { services } from "../services/endpoints";

const resolveConsultationService = () => {
  return (
    services.find((service) => service.name.includes("CONSULTANT")) ||
    services.find((service) =>
      service.endpoints.some((endpoint) => endpoint.path === "/consultations")
    )
  );
};

export default function ConsultationFlowPage() {
  const service = useMemo(() => resolveConsultationService(), []);
  const createEndpoint = useMemo(() => {
    if (!service) return null;
    return service.endpoints.find(
      (endpoint) => endpoint.method === "POST" && endpoint.path === "/consultations"
    );
  }, [service]);

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);

  if (!service || !createEndpoint) {
    return (
      <Alert
        type="error"
        title="Consultation endpoint missing"
        description="The consultation creation endpoint could not be detected."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultation Creation Flow"
        subtitle="Create a new consultation request and capture the generated consultation ID."
        badge={service.name}
      />

      <EndpointForm
        endpoint={createEndpoint}
        service={service}
        token=""
        onSuccess={(data, responseStatus) => {
          setResult(data);
          setStatus(responseStatus);
        }}
      />

      {result ? (
        <div className="card space-y-4">
          <Alert
            type="success"
            title={`Consultation created (${status})`}
            description="Use the consultation ID for downstream payment and prescription steps."
          />
          <JsonViewer data={result} />
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/flows/payment" className="button">
              Go to Payment Flow
            </Link>
            <Link to="/" className="button-secondary">
              Back to Endpoints
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
