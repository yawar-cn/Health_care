import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  acceptConsultation,
  getConsultationsByDoctor,
  getPendingConsultations
} from "../../services/consultationService";
import { useAuthStore } from "../../store/useAuthStore";

export default function ConsultationsPage() {
  const user = useAuthStore((state) => state.user);
  const specialization = user?.specialization;
  const [records, setRecords] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const doctorId = user?.id;

  const fetchAssigned = useCallback(async () => {
    if (!doctorId) {
      setError("Doctor profile not loaded.");
      return;
    }
    try {
      const data = await getConsultationsByDoctor(doctorId);
      setRecords(data || []);
    } catch (err) {
      setError(err?.message || "Unable to load assigned consultations");
    }
  }, [doctorId]);

  const fetchPending = useCallback(async () => {
    if (!specialization) return;
    try {
      const data = await getPendingConsultations(
        specialization,
        doctorId ? String(doctorId) : ""
      );
      setPending(data || []);
    } catch (err) {
      setError(err?.message || "Unable to load pending consultations");
    }
  }, [specialization, doctorId]);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError("");
    await Promise.all([fetchAssigned(), fetchPending()]);
    setLoading(false);
  }, [fetchAssigned, fetchPending]);

  const handleAccept = async (consultationId) => {
    if (!doctorId) return;
    setError("");
    try {
      await acceptConsultation({ id: consultationId, doctorId });
      await handleFetch();
    } catch (err) {
      setError(err?.message || "Unable to accept consultation");
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    handleFetch();
  }, [doctorId, handleFetch]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultations"
        subtitle="Review pending requests and manage assigned consultations."
        action={
          <button className="button" onClick={handleFetch}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        }
      />

      {error ? <p className="text-sm text-blush">{error}</p> : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">Pending Requests</h3>
          <span className="tag bg-frost text-dusk">
            {pending.length} pending
          </span>
        </div>
        {!specialization ? (
          <div className="card text-sm text-dusk/70">
            Add a specialization to your profile to view pending requests.
          </div>
        ) : pending.length === 0 ? (
          <div className="card text-sm text-dusk/70">
            No pending consultations for your specialization.
          </div>
        ) : (
          <div className="grid gap-4">
            {pending.map((item) => (
              <div key={item.id} className="card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-ink">
                    New consultation request
                  </h4>
                  <span className="tag bg-frost text-dusk">{item.status}</span>
                </div>
                <p className="text-sm text-dusk/70">
                  {item.specialization} · {item.description}
                </p>
                <button
                  className="button-secondary"
                  onClick={() => handleAccept(item.id)}
                >
                  Accept Consultation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">
            Assigned Consultations
          </h3>
          <span className="tag bg-frost text-dusk">
            {records.length} assigned
          </span>
        </div>
        {records.length === 0 ? (
          <div className="card text-sm text-dusk/70">
            No consultations assigned.
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((item) => (
              <div key={item.id} className="card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-ink">
                    Consultation details
                  </h4>
                  <span className="tag bg-frost text-dusk">{item.status}</span>
                </div>
                <p className="text-sm text-dusk/70">
                  {item.specialization} · {item.description}
                </p>
                <Link
                  className="button-secondary"
                  to={`/doctor/consultations/${item.id}`}
                >
                  View details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
