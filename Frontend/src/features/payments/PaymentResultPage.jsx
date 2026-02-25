import { useLocation, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

export default function PaymentResultPage() {
  const { status } = useParams();
  const { state } = useLocation();
  const isSuccess = status === "success";

  return (
    <div className="space-y-6">
      <PageHeader
        title={isSuccess ? "Payment Successful" : "Payment Failed"}
        subtitle={state?.message}
      />
      <div className="card">
        <p className="text-sm text-dusk/70">
          {isSuccess
            ? "Your payment has been verified and recorded."
            : "We could not verify the payment. Please try again or contact support."}
        </p>
      </div>
    </div>
  );
}
