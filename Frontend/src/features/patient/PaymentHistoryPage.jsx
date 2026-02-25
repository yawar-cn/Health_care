import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAuthStore } from "../../store/useAuthStore";
import { getConsultationsByPatient } from "../../services/consultationService";

const asCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return value ?? "-";
  }
  return `₹${value}`;
};

const toPaymentKey = (payment) => {
  const type = payment?.paymentType || "PAYMENT";
  const ref = payment?.referenceId || payment?.id || "";
  const amount = payment?.amount ?? "";
  return `${type}:${ref}:${amount}`;
};

export default function PaymentHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const payments = useAuthStore((state) => state.payments);
  const [consultationRecords, setConsultationRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchConsultationPayments = async () => {
    if (!user?.id) {
      setConsultationRecords([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const records = await getConsultationsByPatient(user.id);
      setConsultationRecords(records || []);
    } catch (err) {
      setError(err?.message || "Unable to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultationPayments();
  }, [user?.id]);

  const consultationPayments = useMemo(
    () =>
      consultationRecords
        .filter((record) => ["PAID", "COMPLETED"].includes(record.status))
        .map((record) => ({
          id: `consultation-${record.id}`,
          referenceId: record.id,
          paymentType: "CONSULTATION",
          status: record.status,
          amount:
            typeof record.consultationFee === "number" ? record.consultationFee : undefined,
          createdAt: record.createdAt
        })),
    [consultationRecords]
  );

  const allPayments = useMemo(() => {
    const merged = [...consultationPayments, ...payments];
    const seen = new Set();
    return merged.filter((payment) => {
      const key = toPaymentKey(payment);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [consultationPayments, payments]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment History"
        subtitle="Track consultation and pharmacy payments."
        action={
          <button className="button" onClick={fetchConsultationPayments}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        }
      />

      {error ? <p className="text-sm text-blush">{error}</p> : null}

      <div className="grid gap-4">
        {allPayments.length === 0 ? (
          <div className="card text-sm text-dusk/70">
            No payment records yet.
          </div>
        ) : (
          allPayments.map((payment, index) => (
            <div key={payment.id || payment.referenceId || index} className="card space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">
                  {payment.paymentType || "Payment"}
                </h3>
                <span className="tag bg-frost text-dusk">
                  {payment.status || "PENDING"}
                </span>
              </div>
              <p className="text-sm text-dusk/70">Amount: {asCurrency(payment.amount)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
