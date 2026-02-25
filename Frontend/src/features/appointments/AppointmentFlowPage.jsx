import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  createConsultation,
  getDoctorReviews,
  getDoctorRatingSummary
} from "../../services/consultationService";
import { getDoctors, getSpecializations } from "../../services/userService";
import { useAuthStore } from "../../store/useAuthStore";
import { resolveUserPhotoUrl } from "../../utils/userPhoto";

const formatSpecialization = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatExperience = (value) => {
  if (value == null || Number.isNaN(Number(value))) {
    return "Experience not available";
  }
  const years = Number(value);
  return years === 1 ? "1 year experience" : `${years} years experience`;
};

const formatConsultationFee = (value) => {
  const fee = Number(value);
  if (!Number.isFinite(fee) || fee <= 0) {
    return "Consultation fee: Not set";
  }
  return `Consultation fee: Rs. ${fee.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;
};

const getDoctorPhoto = (doctor) => {
  if (doctor?.photoUrl) {
    return resolveUserPhotoUrl(doctor.photoUrl);
  }
  const name = encodeURIComponent(doctor?.name || "Doctor");
  return `https://ui-avatars.com/api/?name=${name}&background=0b1220&color=ffffff&bold=true`;
};

const getStars = (rating) => {
  const normalized = Number(rating) || 0;
  const filled = Math.max(0, Math.min(5, Math.round(normalized)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
};

const DOCTORS_PER_PAGE = 4;
const REVIEWS_PER_PAGE = 5;

export default function AppointmentFlowPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addAppointment = useAuthStore((state) => state.addAppointment);
  const addNotification = useAuthStore((state) => state.addNotification);
  const [form, setForm] = useState({
    specialization: "",
    doctorId: "",
    description: ""
  });
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorRatings, setDoctorRatings] = useState({});
  const [doctorReviewsById, setDoctorReviewsById] = useState({});
  const [doctorReviewsLoadingById, setDoctorReviewsLoadingById] = useState({});
  const [doctorReviewsErrorById, setDoctorReviewsErrorById] = useState({});
  const [doctorPage, setDoctorPage] = useState(1);
  const [reviewsPageByDoctor, setReviewsPageByDoctor] = useState({});
  const [reviewsModalDoctorId, setReviewsModalDoctorId] = useState("");
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoadingSpecializations(true);
      try {
        const data = await getSpecializations();
        setSpecializations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Unable to load specializations");
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!form.specialization) {
        setDoctors([]);
        setDoctorRatings({});
        setDoctorReviewsById({});
        setDoctorReviewsLoadingById({});
        setDoctorReviewsErrorById({});
        setDoctorPage(1);
        setReviewsPageByDoctor({});
        setReviewsModalDoctorId("");
        return;
      }
      setLoadingDoctors(true);
      try {
        const data = await getDoctors(form.specialization);
        const doctorsList = Array.isArray(data) ? data : [];
        setDoctors(doctorsList);
        setDoctorPage(1);
        if (!doctorsList.some((item) => String(item.id) === String(form.doctorId))) {
          setForm((prev) => ({ ...prev, doctorId: "" }));
        }

        setLoadingRatings(true);
        const ratingEntries = await Promise.all(
          doctorsList.map(async (doctor) => {
            try {
              const summary = await getDoctorRatingSummary(String(doctor.id));
              return [
                String(doctor.id),
                {
                  averageRating: Number(summary?.averageRating || 0),
                  totalReviews: Number(summary?.totalReviews || 0)
                }
              ];
            } catch {
              return [
                String(doctor.id),
                {
                  averageRating: 0,
                  totalReviews: 0
                }
              ];
            }
          })
        );
        setDoctorRatings(Object.fromEntries(ratingEntries));
      } catch (err) {
        setDoctors([]);
        setDoctorRatings({});
        setDoctorReviewsById({});
        setDoctorReviewsLoadingById({});
        setDoctorReviewsErrorById({});
        setDoctorPage(1);
        setReviewsPageByDoctor({});
        setReviewsModalDoctorId("");
        setError(err?.message || "Unable to load doctors");
      } finally {
        setLoadingDoctors(false);
        setLoadingRatings(false);
      }
    };

    fetchDoctors();
  }, [form.specialization]);

  const totalDoctorPages = Math.max(1, Math.ceil(doctors.length / DOCTORS_PER_PAGE));
  const currentDoctorPage = Math.min(doctorPage, totalDoctorPages);
  const paginatedDoctors = useMemo(() => {
    const start = (currentDoctorPage - 1) * DOCTORS_PER_PAGE;
    return doctors.slice(start, start + DOCTORS_PER_PAGE);
  }, [doctors, currentDoctorPage]);

  const updateField = (key, value) => {
    setForm((prev) => {
      if (key === "specialization") {
        return {
          ...prev,
          specialization: value,
          doctorId: ""
        };
      }
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const handleOpenReviews = async (doctorId) => {
    const key = String(doctorId);
    setReviewsModalDoctorId(key);
    setReviewsPageByDoctor((prev) => ({ ...prev, [key]: 1 }));

    if (doctorReviewsById[key]) {
      return;
    }

    setDoctorReviewsLoadingById((prev) => ({ ...prev, [key]: true }));
    setDoctorReviewsErrorById((prev) => ({ ...prev, [key]: "" }));
    try {
      const data = await getDoctorReviews(key);
      setDoctorReviewsById((prev) => ({
        ...prev,
        [key]: Array.isArray(data) ? data : []
      }));
    } catch (err) {
      setDoctorReviewsErrorById((prev) => ({
        ...prev,
        [key]: err?.message || "Unable to load reviews"
      }));
      setDoctorReviewsById((prev) => ({
        ...prev,
        [key]: []
      }));
    } finally {
      setDoctorReviewsLoadingById((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user?.id) {
        throw new Error("Your profile is still loading. Please try again.");
      }
      if (!form.specialization) {
        throw new Error("Please select a specialization.");
      }
      if (!form.doctorId) {
        throw new Error("Please select a doctor.");
      }
      if (!form.description.trim()) {
        throw new Error("Please describe your symptoms.");
      }
      const appointment = await createConsultation({
        patientId: user?.id,
        doctorId: form.doctorId,
        specialization: form.specialization,
        description: form.description.trim()
      });
      addAppointment(appointment);
      addNotification({
        id: `consultation-${Date.now()}`,
        title: "Consultation request submitted",
        message: "A specialist will review your request shortly.",
        read: false,
        createdAt: new Date().toISOString()
      });
      navigate("/patient/appointments");
    } catch (err) {
      setError(err?.message || "Unable to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const modalReviews = reviewsModalDoctorId
    ? doctorReviewsById[reviewsModalDoctorId] || []
    : [];
  const modalReviewPage = reviewsModalDoctorId
    ? reviewsPageByDoctor[reviewsModalDoctorId] || 1
    : 1;
  const totalModalReviewPages = Math.max(
    1,
    Math.ceil(modalReviews.length / REVIEWS_PER_PAGE)
  );
  const currentModalReviewPage = Math.min(modalReviewPage, totalModalReviewPages);
  const paginatedModalReviews = useMemo(() => {
    const start = (currentModalReviewPage - 1) * REVIEWS_PER_PAGE;
    return modalReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [modalReviews, currentModalReviewPage]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Request a Consultation"
        subtitle="Select specialization, pick your doctor card, and describe your symptoms."
      />

      <div className="card space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Specialization
          </label>
          <select
            className="input"
            value={form.specialization}
            onChange={(event) => updateField("specialization", event.target.value)}
            disabled={loadingSpecializations}
          >
            <option value="">
              {loadingSpecializations
                ? "Loading specializations..."
                : "Select specialization"}
            </option>
            {specializations.map((item) => (
              <option key={item} value={item}>
                {formatSpecialization(item)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Available doctors
          </label>
          {!form.specialization ? (
            <div className="card text-sm text-dusk/70">
              Select a specialization to view doctors.
            </div>
          ) : loadingDoctors ? (
            <div className="card text-sm text-dusk/70">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="card text-sm text-dusk/70">
              No doctors available for this specialization.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {paginatedDoctors.map((doctor) => {
                const isSelected = String(form.doctorId) === String(doctor.id);
                const rating = doctorRatings[String(doctor.id)] || {
                  averageRating: 0,
                  totalReviews: 0
                };

                return (
                  <div
                    key={doctor.id}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-ink bg-white shadow-sm"
                        : "border-slate-200 bg-white/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={getDoctorPhoto(doctor)}
                        alt={doctor.name || "Doctor"}
                        className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-ink">
                          {doctor.name || "Doctor"}
                        </p>
                        <p className="text-xs text-dusk/70">
                          {formatExperience(doctor.experience)}
                        </p>
                        <p className="text-xs text-dusk/70">
                          {formatConsultationFee(doctor.consultationFee)}
                        </p>
                        <p className="text-sm font-semibold text-amber-500">
                          {loadingRatings ? "Loading rating..." : getStars(rating.averageRating)}
                        </p>
                        <p className="text-xs text-dusk/70">
                          {Number(rating.averageRating || 0).toFixed(1)} / 5 ·{" "}
                          {rating.totalReviews} reviews
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                              isSelected
                                ? "bg-ink text-white"
                                : "bg-frost text-ink hover:bg-slate-200"
                            }`}
                            onClick={() =>
                              updateField(
                                "doctorId",
                                isSelected ? "" : String(doctor.id)
                              )
                            }
                          >
                            {isSelected ? "Deselect" : "Select Doctor"}
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-ink transition hover:border-slate-300"
                            onClick={() => handleOpenReviews(doctor.id)}
                          >
                            Read Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {doctors.length > DOCTORS_PER_PAGE ? (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                className="button-secondary"
                disabled={currentDoctorPage <= 1}
                onClick={() => setDoctorPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              <span className="text-xs text-dusk/70">
                Page {currentDoctorPage} of {totalDoctorPages}
              </span>
              <button
                type="button"
                className="button-secondary"
                disabled={currentDoctorPage >= totalDoctorPages}
                onClick={() =>
                  setDoctorPage((page) => Math.min(totalDoctorPages, page + 1))
                }
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Symptoms / Description
          </label>
          <textarea
            className="input min-h-[140px]"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe your symptoms..."
          />
        </div>

        {error ? <p className="text-sm text-blush">{error}</p> : null}

        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>

      {reviewsModalDoctorId ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Doctor Reviews</h3>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-semibold text-ink transition hover:border-slate-300"
                onClick={() => setReviewsModalDoctorId("")}
              >
                Close
              </button>
            </div>

            {doctorReviewsLoadingById[reviewsModalDoctorId] ? (
              <p className="text-sm text-dusk/70">Loading reviews...</p>
            ) : doctorReviewsErrorById[reviewsModalDoctorId] ? (
              <p className="text-sm text-blush">
                {doctorReviewsErrorById[reviewsModalDoctorId]}
              </p>
            ) : (doctorReviewsById[reviewsModalDoctorId] || []).length === 0 ? (
              <p className="text-sm text-dusk/70">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="max-h-[52vh] space-y-3 overflow-auto pr-1">
                  {paginatedModalReviews.map((review) => (
                    <div
                      key={review.id || `${review.consultationId}-${review.patientId}`}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <p className="text-sm font-semibold text-amber-500">
                        {getStars(review.rating)} ({review.rating}/5)
                      </p>
                      <p className="mt-1 text-sm text-dusk/80">
                        {review.review || "No comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
                {modalReviews.length > REVIEWS_PER_PAGE ? (
                  <div
                    className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2"
                  >
                    <button
                      type="button"
                      className="button-secondary"
                      disabled={currentModalReviewPage <= 1}
                      onClick={() =>
                        setReviewsPageByDoctor((prev) => ({
                          ...prev,
                          [reviewsModalDoctorId]: Math.max(1, currentModalReviewPage - 1)
                        }))
                      }
                    >
                      Previous
                    </button>
                    <span className="text-xs text-dusk/70">
                      Page {currentModalReviewPage} of {totalModalReviewPages}
                    </span>
                    <button
                      type="button"
                      className="button-secondary"
                      disabled={currentModalReviewPage >= totalModalReviewPages}
                      onClick={() =>
                        setReviewsPageByDoctor((prev) => ({
                          ...prev,
                          [reviewsModalDoctorId]: Math.min(
                            totalModalReviewPages,
                            currentModalReviewPage + 1
                          )
                        }))
                      }
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
