import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import LoadingIndicator from "../components/LoadingIndicator";
import PageHeader from "../components/PageHeader";
import { requestEndpoint } from "../services/apiClient";
import { services } from "../services/endpoints";

const resolvePaymentService = () =>
  services.find((service) => service.name.toLowerCase().includes("payment"));

const useQueryParams = () => {
  const { search } = useLocation();
  return useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
};

export default function PaymentVerifyRedirectPage() {
  const params = useQueryParams();
  const navigate = useNavigate();
  const service = useMemo(() => resolvePaymentService(), []);
  const verifyEndpoint = useMemo(() => {
    if (!service) return null;
    return service.endpoints.find(
      (endpoint) => endpoint.method === "POST" && endpoint.path === "/payments/verify"
    );
  }, [service]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    const runVerify = async () => {
      if (!service || !verifyEndpoint) return;
      try {
        await requestEndpoint({
          endpoint: verifyEndpoint,
          service,
          values: params,
          token: ""
        });
        if (isActive) {
          navigate("/status/success", {
            state: {
              title: "Payment verified",
              description: "Payment verification succeeded."
            }
          });
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Verification failed");
          navigate("/status/failure", {
            state: {
              title: "Payment verification failed",
              description: err.message || "Verification failed"
            }
          });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    runVerify();
    return () => {
      isActive = false;
    };
  }, [service, verifyEndpoint, params, navigate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifying Payment"
        subtitle="Processing payment verification redirect."
      />
      {loading ? <LoadingIndicator label="Verifying payment..." /> : null}
      {error ? <Alert type="error" title="Verification error" description={error} /> : null}
    </div>
  );
}
