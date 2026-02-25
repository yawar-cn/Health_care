import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  acceptConsultation,
  addPrescription,
  getConsultationById
} from "../../services/consultationService";
import { searchMedicines } from "../../services/medicineService";
import { useAuthStore } from "../../store/useAuthStore";

export default function ConsultationDetailPage() {
  const { id } = useParams();
  const doctor = useAuthStore((state) => state.user);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState({
    precautions: "",
    notes: ""
  });
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineResults, setMedicineResults] = useState([]);
  const [medicineSelected, setMedicineSelected] = useState([]);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [medicineError, setMedicineError] = useState("");

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConsultationById(id);
      setRecord(data);
    } catch (err) {
      setError(err?.message || "Unable to load consultation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    const query = medicineQuery.trim();
    if (query.length < 2) {
      setMedicineResults([]);
      setMedicineError("");
      return;
    }

    const timer = setTimeout(async () => {
      setMedicineLoading(true);
      setMedicineError("");
      try {
        const data = await searchMedicines(query);
        setMedicineResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setMedicineError(err?.message || "Unable to search medicines");
      } finally {
        setMedicineLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [medicineQuery]);

  const handleSelectMedicine = (medicine) => {
    setMedicineSelected((prev) => {
      if (prev.some((item) => item.id === medicine.id)) return prev;
      return [...prev, medicine];
    });
    setMedicineQuery("");
    setMedicineResults([]);
  };

  const handleRemoveMedicine = (medicineId) => {
    setMedicineSelected((prev) =>
      prev.filter((item) => item.id !== medicineId)
    );
  };

  const handleAccept = async () => {
    setError("");
    try {
      await acceptConsultation({ id, doctorId: doctor?.id || "" });
      fetchDetails();
    } catch (err) {
      setError(err?.message || "Unable to accept consultation");
    }
  };

  const handlePrescription = async () => {
    setError("");
    try {
      await addPrescription({
        id,
        medicineIds: medicineSelected.map((item) => String(item.id)),
        precautions: prescription.precautions,
        notes: prescription.notes
      });
      fetchDetails();
    } catch (err) {
      setError(err?.message || "Unable to add prescription");
    }
  };

  const status = record?.status ? String(record.status).toUpperCase() : "";
  const canAccept = status === "PENDING";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultation Details"
        subtitle="Update consultation status and add prescription notes."
      />

      {loading ? <p className="text-sm text-dusk">Loading...</p> : null}
      {error ? <p className="text-sm text-blush">{error}</p> : null}

      {record ? (
        <div className="card space-y-3">
          <p className="text-sm text-dusk/70">Status: {record.status}</p>
          <p className="text-sm text-dusk/70">
            Specialization: {record.specialization}
          </p>
          <p className="text-sm text-dusk/70">Description: {record.description}</p>
          {canAccept ? (
            <button className="button-secondary" onClick={handleAccept}>
              Accept Consultation
            </button>
          ) : null}
        </div>
      ) : null}

      {record?.status === "ACCEPTED" ? (
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-ink">Prescription Notes</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                Medicines (search by name)
              </label>
              <input
                className="input"
                placeholder="Type at least 2 characters"
                value={medicineQuery}
                onChange={(event) => setMedicineQuery(event.target.value)}
              />
              {medicineLoading ? (
                <p className="text-xs text-dusk/70">Searching medicines...</p>
              ) : null}
              {medicineError ? (
                <p className="text-xs text-blush">{medicineError}</p>
              ) : null}
              {medicineQuery.trim().length >= 2 &&
              !medicineLoading &&
              medicineResults.length === 0 ? (
                <p className="text-xs text-dusk/70">No medicines found.</p>
              ) : null}
              {medicineResults.length > 0 ? (
                <div className="space-y-2">
                  {medicineResults.map((medicine) => {
                    const isSelected = medicineSelected.some(
                      (item) => item.id === medicine.id
                    );
                    return (
                      <button
                        key={medicine.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-left text-sm text-ink transition hover:border-ocean/40 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleSelectMedicine(medicine)}
                        disabled={isSelected}
                      >
                        <span className="font-medium">{medicine.name}</span>
                        {medicine.manufacturer ? (
                          <span className="text-xs text-dusk/70">
                            {medicine.manufacturer}
                          </span>
                        ) : null}
                        <span className="text-xs font-semibold uppercase tracking-widest text-dusk">
                          {isSelected ? "Selected" : "Add"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {medicineSelected.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medicineSelected.map((medicine) => (
                    <div key={medicine.id} className="tag bg-frost text-dusk">
                      <span>{medicine.name}</span>
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() => handleRemoveMedicine(medicine.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="text-xs text-dusk/70">
              Consultation fee will be applied from your profile settings.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input"
                placeholder="Precautions"
                value={prescription.precautions}
                onChange={(event) =>
                  setPrescription((prev) => ({
                    ...prev,
                    precautions: event.target.value
                  }))
                }
              />
              <input
                className="input"
                placeholder="Doctor notes"
                value={prescription.notes}
                onChange={(event) =>
                  setPrescription((prev) => ({
                    ...prev,
                    notes: event.target.value
                  }))
                }
              />
            </div>
          </div>
          <button className="button" onClick={handlePrescription}>
            Save Prescription
          </button>
        </div>
      ) : null}
    </div>
  );
}
