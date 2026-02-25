import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAuthStore } from "../../store/useAuthStore";
import {
  getConsultationsByDoctor,
  getConsultationsByPatient,
  getPatientReviews,
  upsertDoctorReview
} from "../../services/consultationService";
import { getMedicinesBulk } from "../../services/medicineService";

const buildReviewDraft = (review) => ({
  rating: String(review?.rating ?? 5),
  review: review?.review ?? ""
});

export default function MedicalRecordsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicineMap, setMedicineMap] = useState({});
  const [patientReviewsByConsultation, setPatientReviewsByConsultation] = useState({});
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewSavingByConsultation, setReviewSavingByConsultation] = useState({});

  const fetchRecords = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data =
        role === "DOCTOR"
          ? await getConsultationsByDoctor(user.id)
          : await getConsultationsByPatient(user.id);
      setRecords(data || []);
    } catch (err) {
      setError(err?.message || "Unable to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user?.id, role]);

  useEffect(() => {
    const fetchPatientReviewData = async () => {
      if (role !== "PATIENT" || !user?.id) {
        setPatientReviewsByConsultation({});
        return;
      }
      try {
        const data = await getPatientReviews(String(user.id));
        const map = {};
        (data || []).forEach((review) => {
          if (review?.consultationId) {
            map[review.consultationId] = review;
          }
        });
        setPatientReviewsByConsultation(map);
      } catch (err) {
        setError(err?.message || "Unable to load your reviews");
      }
    };

    fetchPatientReviewData();
  }, [role, user?.id]);

  useEffect(() => {
    const ids = records
      .flatMap((record) => record.medicineIds || [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    const uniqueIds = Array.from(new Set(ids));
    if (uniqueIds.length === 0) {
      setMedicineMap({});
      return;
    }

    const loadMedicines = async () => {
      try {
        const data = await getMedicinesBulk(uniqueIds);
        const map = {};
        (data || []).forEach((medicine) => {
          map[medicine.id] = medicine;
        });
        setMedicineMap(map);
      } catch {
        setMedicineMap({});
      }
    };

    loadMedicines();
  }, [records]);

  const patientRecords = useMemo(() => {
    if (role !== "PATIENT") return records;
    return records.filter((record) =>
      ["PAID", "COMPLETED"].includes(record.status)
    );
  }, [records, role]);

  const getReviewDraft = (consultationId) =>
    reviewDrafts[consultationId] ||
    buildReviewDraft(patientReviewsByConsultation[consultationId]);

  const updateReviewDraft = (consultationId, key, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [consultationId]: {
        ...(prev[consultationId] ||
          buildReviewDraft(patientReviewsByConsultation[consultationId])),
        [key]: value
      }
    }));
  };

  const handleReviewSubmit = async (record) => {
    if (!record?.doctorId || !record?.id || !user?.id) return;
    const draft = getReviewDraft(record.id);
    const rating = Number(draft.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setReviewSavingByConsultation((prev) => ({ ...prev, [record.id]: true }));
    setError("");
    try {
      const saved = await upsertDoctorReview({
        doctorId: record.doctorId,
        patientId: String(user.id),
        consultationId: record.id,
        rating,
        review: draft.review
      });
      setPatientReviewsByConsultation((prev) => ({
        ...prev,
        [record.id]: saved
      }));
      setReviewDrafts((prev) => ({
        ...prev,
        [record.id]: buildReviewDraft(saved)
      }));
    } catch (err) {
      setError(err?.message || "Unable to submit review");
    } finally {
      setReviewSavingByConsultation((prev) => ({ ...prev, [record.id]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Medical Records"
        subtitle="Review prescriptions and consultation history."
        action={
          <button className="button" onClick={fetchRecords}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        }
      />

      {error ? <p className="text-sm text-blush">{error}</p> : null}

      <div className="grid gap-4">
        {patientRecords.length === 0 ? (
          <div className="card text-sm text-dusk/70">
            {role === "PATIENT" && records.length > 0
              ? "Prescriptions will appear after payment."
              : "No medical records available."}
          </div>
        ) : (
          patientRecords.map((record) => {
            const existingReview = patientReviewsByConsultation[record.id];
            const reviewDraft = getReviewDraft(record.id);
            const reviewSaving = Boolean(reviewSavingByConsultation[record.id]);

            return (
              <div key={record.id} className="card space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-ink">Consultation</h3>
                  <span className="tag bg-frost text-dusk">{record.status}</span>
                </div>
                <p className="text-sm text-dusk/70">
                  {record.specialization} · {record.description}
                </p>
                {role === "PATIENT" ? (
                  <div className="space-y-3 text-sm text-dusk/70">
                    {record.precautions ? (
                      <p>Precautions: {record.precautions}</p>
                    ) : null}
                    {record.doctorNotes ? (
                      <p>Doctor notes: {record.doctorNotes}</p>
                    ) : null}
                    {record.medicineIds && record.medicineIds.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-dusk">
                          Prescribed medicines
                        </p>
                        <ul className="space-y-1">
                          {record.medicineIds.map((medicineId) => {
                            const medicine = medicineMap[medicineId];
                            return (
                              <li key={medicineId}>
                                {medicine?.name || "Prescribed medicine"}
                              </li>
                            );
                          })}
                        </ul>
                        <button
                          className="button-secondary"
                          onClick={() => {
                            const total = record.medicineIds.reduce(
                              (sum, medicineId) =>
                                sum + (medicineMap[medicineId]?.price || 0),
                              0
                            );
                            navigate("/payments", {
                              state: {
                                referenceId: record.id,
                                paymentType: "MEDICINE",
                                amount: total
                              }
                            });
                          }}
                        >
                          Buy prescribed medicines
                        </button>
                      </div>
                    ) : null}
                    {record.doctorId ? (
                      <div className="space-y-2 border-t border-slate-200/70 pt-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-dusk">
                          Rate this doctor
                        </p>
                        <select
                          className="input max-w-xs"
                          value={reviewDraft.rating}
                          onChange={(event) =>
                            updateReviewDraft(record.id, "rating", event.target.value)
                          }
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                        <textarea
                          className="input min-h-[90px]"
                          placeholder="Share your review"
                          value={reviewDraft.review}
                          onChange={(event) =>
                            updateReviewDraft(record.id, "review", event.target.value)
                          }
                        />
                        <div className="flex items-center gap-3">
                          <button
                            className="button-secondary"
                            onClick={() => handleReviewSubmit(record)}
                            disabled={reviewSaving}
                          >
                            {reviewSaving
                              ? "Saving..."
                              : existingReview
                                ? "Update review"
                                : "Submit review"}
                          </button>
                          {existingReview ? (
                            <p className="text-xs text-dusk/70">
                              Your current rating: {existingReview.rating}/5
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
