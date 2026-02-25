import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { verifyPayment } from "../../services/paymentService";
import { useAuthStore } from "../../store/useAuthStore";

const useQueryParams = () => {
  const { search } = useLocation();
  return Object.fromEntries(new URLSearchParams(search));
};

export default function PaymentVerifyPage() {
  const params = useQueryParams();
  const navigate = useNavigate();
  const addPayment = useAuthStore((state) => state.addPayment);
  const addNotification = useAuthStore((state) => state.addNotification);

  useEffect(() => {
    const runVerification = async () => {
      try {
        await verifyPayment({
          ...params,
          amount: Number(params.amount)
        });

        addPayment({
          referenceId: params.referenceId,
          paymentType: params.paymentType || "PAYMENT",
          amount: Number(params.amount),
          status: "PAID"
        });

        addNotification({
          id: `payment-${Date.now()}`,
          title: "Payment verified",
          message:
            params.paymentType === "CONSULTATION"
              ? "Consultation payment completed."
              : "Payment completed.",
          read: false,
          createdAt: new Date().toISOString()
        });

        navigate("/payments/result/success", {
          state: { message: "Payment verified successfully" }
        });
      } catch (err) {
        navigate("/payments/result/failure", {
          state: { message: err?.message || "Payment verification failed" }
        });
      }
    };

    runVerification();
  }, [navigate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifying Payment"
        subtitle="We are confirming your payment details."
      />
      <div className="card text-sm text-dusk/70">Processing...</div>
    </div>
  );
}
