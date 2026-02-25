import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSpecializations,
  registerUser,
  uploadUserPhotoFile
} from "../../services/userService";

const roleOptions = ["PATIENT", "DOCTOR", "ADMIN"];
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const formatSpecialization = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PATIENT",
    specialization: "",
    experience: ""
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateRole = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      specialization: role === "DOCTOR" ? prev.specialization : "",
      experience: role === "DOCTOR" ? prev.experience : ""
    }));
  };

  useEffect(
    () => () => {
      if (selectedPhotoPreview) {
        URL.revokeObjectURL(selectedPhotoPreview);
      }
    },
    [selectedPhotoPreview]
  );

  const clearSelectedPhoto = () => {
    setSelectedPhotoFile(null);
    setSelectedPhotoName("");
    setSelectedPhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      clearSelectedPhoto();
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setError("Profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedPhotoFile(file);
    setSelectedPhotoName(file.name || "");
    setSelectedPhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        specialization: form.role === "DOCTOR" ? form.specialization : null,
        experience:
          form.role === "DOCTOR" && form.experience
            ? Number(form.experience)
            : null
      };
      const registeredUser = await registerUser(payload);

      if (selectedPhotoFile && registeredUser?.id) {
        try {
          await uploadUserPhotoFile({
            id: registeredUser.id,
            file: selectedPhotoFile
          });
        } catch {
          setError(
            "Account created, but photo upload failed. You can upload the photo from Profile after login."
          );
          navigate("/login");
          return;
        }
      }
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Create your MediConnect account
        </h2>
        <p className="text-sm text-dusk/80">
          Register as a patient, doctor, or admin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Full name
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ayesha Khan"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Email
            </label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Phone
            </label>
            <input
              className="input"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Password
            </label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Profile photo
          </label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <p className="text-xs text-dusk/70">
            Optional. Upload JPG/PNG/WEBP up to 5 MB.
          </p>
          {selectedPhotoPreview ? (
            <div className="flex items-center gap-3">
              <img
                src={selectedPhotoPreview}
                alt="Profile preview"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="space-y-1">
                {selectedPhotoName ? (
                  <p className="text-xs text-dusk/70">{selectedPhotoName}</p>
                ) : null}
                <button
                  type="button"
                  className="button-secondary px-3 py-1.5 text-xs"
                  onClick={clearSelectedPhoto}
                >
                  Remove photo
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Role
            </label>
            <select
              className="input"
              value={form.role}
              onChange={(event) => updateRole(event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {form.role === "DOCTOR" ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                Specialization
              </label>
              <select
                className="input"
                value={form.specialization}
                onChange={(event) => updateField("specialization", event.target.value)}
                required
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
          ) : null}
        </div>

        {form.role === "DOCTOR" ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
              Experience (years)
            </label>
            <input
              className="input"
              value={form.experience}
              onChange={(event) => updateField("experience", event.target.value)}
              placeholder="5"
              type="number"
              min="0"
            />
          </div>
        ) : null}

        {error ? <p className="text-sm text-blush">{error}</p> : null}

        <button className="button w-full" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-dusk/70">
        Already have an account?{" "}
        <a className="font-semibold text-ink underline" href="/login">
          Login
        </a>
      </p>
    </div>
  );
}
