import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import EndpointForm from "../components/EndpointForm";
import PageHeader from "../components/PageHeader";
import { services } from "../services/endpoints";

const resolvePaymentService = () =>
  services.find((service) => service.name.toLowerCase().includes("payment"));

export default function PaymentFlowPage() {
  const service = useMemo(() => resolvePaymentService(), []);
  const createEndpoint = useMemo(() => {
    if (!service) return null;
    return service.endpoints.find(
      (endpoint) =>
        endpoint.method === "POST" && endpoint.path === "/payments/create-order"
    );
  }, [service]);
  const verifyEndpoint = useMemo(() => {
    if (!service) return null;
    return service.endpoints.find(
      (endpoint) => endpoint.method === "POST" && endpoint.path === "/payments/verify"
    );
  }, [service]);

  const [verifyPayload, setVerifyPayload] = useState(null);
  const navigate = useNavigate();

  if (!service || !createEndpoint || !verifyEndpoint) {
    return (
      <Alert
        type="error"
        title="Payment endpoints missing"
        description="The payment create or verify endpoint could not be detected."
      />
    );
  }

  const handleRedirect = () => {
    if (!verifyPayload) return;
    const query = new URLSearchParams(verifyPayload).toString();
    navigate(`/payment/verify?${query}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment Flow"
        subtitle="Create a Razorpay order and verify the payment signature."
        badge={service.name}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EndpointForm
          endpoint={createEndpoint}
          service={service}
          token=""
        />
        <div className="space-y-4">
          <EndpointForm
            endpoint={verifyEndpoint}
            service={service}
            token=""
            onSuccess={(data, status, values) => {
              setVerifyPayload({
                ...values,
                status
              });
            }}
          />
          <div className="card space-y-3">
            <h3 className="text-sm font-semibold text-ink">Verify Redirect</h3>
            <p className="text-xs text-dusk/70">
              Simulate a payment gateway redirect by navigating to the verify page
              with query parameters.
            </p>
            <button className="button" onClick={handleRedirect}>
              Trigger Verify Redirect
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/status/success" className="button-secondary">
          View Success Page
        </Link>
        <Link to="/status/failure" className="button-secondary">
          View Failure Page
        </Link>
      </div>
    </div>
  );
}
