import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getConsultationsByPatient } from "../../services/consultationService";
import { useAuthStore } from "../../store/useAuthStore";

export default function AppointmentHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setAppointments = useAuthStore((state) => state.setAppointments);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getConsultationsByPatient(user.id);
      setRecords(data || []);
      setAppointments(data || []);
    } catch (err) {
      setError(err?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointment History"
        subtitle="Review your consultations and booking status."
        action={
          <button className="button" onClick={handleFetch}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        }
      />

      {error ? <p className="text-sm text-blush">{error}</p> : null}

      <div className="grid gap-4">
        {records.length === 0 ? (
          <div className="card text-sm text-dusk/70">No appointments found.</div>
        ) : (
          records.map((item) => (
            <div key={item.id} className="card space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">
                  Consultation request
                </h3>
                <span className="tag bg-frost text-dusk">{item.status}</span>
              </div>
              <p className="text-sm text-dusk/70">
                {item.specialization} · {item.description}
              </p>
              {item.status === "PAYMENT_PENDING" ? (
                <p className="text-sm text-dusk/70">
                  Consultation fee:{" "}
                  {item.consultationFee != null
                    ? `₹${item.consultationFee}`
                    : "Not set yet"}
                </p>
              ) : null}
              {item.status === "PAYMENT_PENDING" && item.consultationFee != null ? (
                <button
                  className="button-secondary"
                  onClick={() =>
                    navigate("/payments", {
                      state: {
                        referenceId: item.id,
                        paymentType: "CONSULTATION",
                        amount: item.consultationFee
                      }
                    })
                  }
                >
                  Pay consultation fee
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
