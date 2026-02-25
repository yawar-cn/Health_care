import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";
import { useAuthStore } from "../../store/useAuthStore";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const addPayment = useAuthStore((state) => state.addPayment);
  const addNotification = useAuthStore((state) => state.addNotification);

  const paymentContext = useMemo(
    () => ({
      referenceId: location.state?.referenceId || "",
      paymentType: location.state?.paymentType || "CONSULTATION",
      amount: location.state?.amount || ""
    }),
    [location.state]
  );

  const [amount, setAmount] = useState(paymentContext.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(paymentContext.amount);
  }, [paymentContext.amount]);

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay key is not configured.");
      }
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const orderPayload = {
        referenceId: paymentContext.referenceId,
        paymentType: paymentContext.paymentType,
        amount: Number(amount)
      };

      const orderResponse = await createPaymentOrder(orderPayload);
      const orderData =
        typeof orderResponse === "string" ? JSON.parse(orderResponse) : orderResponse;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "MediConnect",
        description:
          paymentContext.paymentType === "CONSULTATION"
            ? "Consultation Payment"
            : "Medicine Payment",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              referenceId: paymentContext.referenceId,
              paymentType: paymentContext.paymentType,
              amount: Number(amount)
            });

            addPayment({
              referenceId: paymentContext.referenceId,
              paymentType: paymentContext.paymentType,
              amount: Number(amount),
              status: "PAID"
            });

            addNotification({
              id: `payment-${Date.now()}`,
              title: "Payment verified",
              message:
                paymentContext.paymentType === "CONSULTATION"
                  ? "Consultation payment completed."
                  : "Medicine payment completed.",
              read: false,
              createdAt: new Date().toISOString()
            });

            navigate("/payments/result/success", {
              state: { message: "Payment verified successfully" }
            });
          } catch (err) {
            setError(err?.message || "Payment verification failed");
            navigate("/payments/result/failure", {
              state: { message: err?.message || "Payment failed" }
            });
          }
        },
        theme: {
          color: "#0b1220"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!paymentContext.referenceId) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Payments"
          subtitle="Select a consultation or prescription to continue."
        />
        <div className="card text-sm text-dusk/70">
          Open your appointments or medical records to proceed with a payment.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Payment" subtitle="Complete your payment securely." />

      {error ? <p className="text-sm text-blush">{error}</p> : null}

      <div className="card space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
            Payment type
          </p>
          <p className="text-lg font-semibold text-ink">
            {paymentContext.paymentType === "CONSULTATION"
              ? "Consultation fee"
              : "Medicine order"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Amount (INR)
          </label>
          <input
            className="input"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <button className="button" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
}
