import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAuthStore } from "../../store/useAuthStore";
import {
  getUserByEmail,
  updateUserPhoto,
  updateUserProfile,
  uploadUserPhotoFile
} from "../../services/userService";
import { getDoctorRatingSummary } from "../../services/consultationService";
import { resolveUserPhotoUrl } from "../../utils/userPhoto";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const formatSpecialization = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getAvatarFallback = (name) => {
  const encoded = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encoded}&background=0b1220&color=ffffff&bold=true`;
};

const getProfilePhoto = (profile) => {
  if (profile?.photoUrl) {
    return resolveUserPhotoUrl(profile.photoUrl);
  }
  return getAvatarFallback(profile?.name);
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profile, setProfile] = useState(user);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    consultationFee: ""
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      setLoading(true);
      setError("");
      try {
        const data = await getUserByEmail(user.email);
        setProfile(data);
      } catch (err) {
        setError(err?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email]);

  useEffect(() => {
    const fetchDoctorRating = async () => {
      if (role !== "DOCTOR" || !user?.id) {
        setRatingSummary(null);
        return;
      }
      try {
        const data = await getDoctorRatingSummary(String(user.id));
        setRatingSummary(data || null);
      } catch {
        setRatingSummary(null);
      }
    };

    fetchDoctorRating();
  }, [role, user?.id]);

  useEffect(
    () => () => {
      if (selectedPhotoPreview) {
        URL.revokeObjectURL(selectedPhotoPreview);
      }
    },
    [selectedPhotoPreview]
  );

  const resetEditState = (data = profile) => {
    setEditForm({
      name: data?.name || "",
      phone: data?.phone || "",
      consultationFee:
        data?.consultationFee != null ? String(data.consultationFee) : ""
    });
    setEditError("");
    setSelectedPhotoFile(null);
    setSelectedPhotoName("");
    setSelectedPhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
    setRemoveCurrentPhoto(false);
  };

  const openEditModal = () => {
    resetEditState(profile);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    resetEditState(profile);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedPhotoFile(null);
      setSelectedPhotoName("");
      setSelectedPhotoPreview((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return "";
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setEditError("Please upload a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setEditError("Profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setEditError("");
    setSelectedPhotoFile(file);
    setSelectedPhotoName(file.name || "");
    setRemoveCurrentPhoto(false);
    setSelectedPhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      setEditError("Your profile is still loading. Please try again.");
      return;
    }

    const name = editForm.name.trim();
    const phone = editForm.phone.trim();
    if (!name) {
      setEditError("Name is required.");
      return;
    }
    if (!phone) {
      setEditError("Phone is required.");
      return;
    }

    let consultationFeeValue;
    if (role === "DOCTOR") {
      const parsedFee = Number(editForm.consultationFee);
      if (!Number.isFinite(parsedFee) || parsedFee <= 0) {
        setEditError("Consultation fee must be greater than zero.");
        return;
      }
      consultationFeeValue = parsedFee;
    }

    setEditSaving(true);
    setEditError("");
    setEditMessage("");
    try {
      let updatedProfile = await updateUserProfile({
        id: user.id,
        name,
        phone,
        consultationFee: role === "DOCTOR" ? consultationFeeValue : undefined
      });

      if (selectedPhotoFile) {
        updatedProfile = await uploadUserPhotoFile({
          id: user.id,
          file: selectedPhotoFile
        });
      } else if (removeCurrentPhoto && profile?.photoUrl) {
        updatedProfile = await updateUserPhoto({
          id: user.id,
          photoUrl: ""
        });
      }

      const finalProfile = updatedProfile || profile;
      setProfile(finalProfile);
      updateUser(finalProfile);
      setEditMessage("Profile updated.");
      setIsEditOpen(false);
      resetEditState(finalProfile);
    } catch (err) {
      setEditError(err?.message || "Unable to update profile");
    } finally {
      setEditSaving(false);
    }
  };

  const pagePhoto = getProfilePhoto(profile);
  const modalPhoto = useMemo(() => {
    if (selectedPhotoPreview) {
      return selectedPhotoPreview;
    }
    if (removeCurrentPhoto) {
      return getAvatarFallback(editForm.name || profile?.name);
    }
    return pagePhoto;
  }, [selectedPhotoPreview, removeCurrentPhoto, editForm.name, profile?.name, pagePhoto]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        subtitle={
          role === "DOCTOR"
            ? "Doctor profile details and specialization information."
            : "Patient profile details and contact information."
        }
        action={
          <button type="button" className="button-secondary" onClick={openEditModal}>
            Edit Profile
          </button>
        }
      />

      <div className="card space-y-4">
        {loading ? <p className="text-sm text-dusk">Loading...</p> : null}
        {error ? <p className="text-sm text-blush">{error}</p> : null}
        {editMessage ? <p className="text-sm text-emerald-700">{editMessage}</p> : null}

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
          <img
            src={pagePhoto}
            alt={`${profile?.name || "User"} profile`}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="text-lg font-semibold text-ink">{profile?.name || "-"}</p>
            <p className="text-sm text-dusk/70">{profile?.email || "-"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Name</p>
            <p className="text-lg font-semibold text-ink">{profile?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Email</p>
            <p className="text-lg font-semibold text-ink">{profile?.email || "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Phone</p>
            <p className="text-lg font-semibold text-ink">{profile?.phone || "-"}</p>
          </div>
          {role === "DOCTOR" ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
                Specialization
              </p>
              <p className="text-lg font-semibold text-ink">
                {profile?.specialization
                  ? formatSpecialization(profile.specialization)
                  : "-"}
              </p>
            </div>
          ) : null}
          {role === "DOCTOR" ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Experience</p>
              <p className="text-lg font-semibold text-ink">
                {profile?.experience != null ? `${profile.experience} years` : "-"}
              </p>
            </div>
          ) : null}
          {role === "DOCTOR" ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
                Consultation Fee
              </p>
              <p className="text-lg font-semibold text-ink">
                {profile?.consultationFee != null ? `₹${profile.consultationFee}` : "-"}
              </p>
            </div>
          ) : null}
          {role === "DOCTOR" ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
                Average Rating
              </p>
              <p className="text-lg font-semibold text-ink">
                {ratingSummary ? `${ratingSummary.averageRating}/5` : "-"}
              </p>
            </div>
          ) : null}
          {role === "DOCTOR" ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Total Reviews</p>
              <p className="text-lg font-semibold text-ink">
                {ratingSummary ? ratingSummary.totalReviews : 0}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {isEditOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Edit Profile</h3>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-semibold text-ink transition hover:border-slate-300"
                onClick={closeEditModal}
                disabled={editSaving}
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <img
                    src={modalPhoto}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                      Profile photo
                    </label>
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={editSaving}
                    />
                    <p className="text-xs text-dusk/70">
                      Upload JPG/PNG/WEBP up to 5 MB.
                    </p>
                    {selectedPhotoName ? (
                      <p className="text-xs text-dusk/70">Selected: {selectedPhotoName}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {profile?.photoUrl && !selectedPhotoFile ? (
                        <button
                          type="button"
                          className="button-secondary px-3 py-1.5 text-xs"
                          disabled={editSaving}
                          onClick={() => setRemoveCurrentPhoto((value) => !value)}
                        >
                          {removeCurrentPhoto
                            ? "Keep Current Photo"
                            : "Remove Current Photo"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                    Name
                  </label>
                  <input
                    className="input"
                    value={editForm.name}
                    onChange={(event) => {
                      setEditForm((prev) => ({ ...prev, name: event.target.value }));
                      setEditError("");
                    }}
                    disabled={editSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                    Phone
                  </label>
                  <input
                    className="input"
                    value={editForm.phone}
                    onChange={(event) => {
                      setEditForm((prev) => ({ ...prev, phone: event.target.value }));
                      setEditError("");
                    }}
                    disabled={editSaving}
                  />
                </div>
                {role === "DOCTOR" ? (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
                      Consultation Fee (INR)
                    </label>
                    <input
                      className="input max-w-xs"
                      type="number"
                      min="1"
                      value={editForm.consultationFee}
                      onChange={(event) => {
                        setEditForm((prev) => ({
                          ...prev,
                          consultationFee: event.target.value
                        }));
                        setEditError("");
                      }}
                      disabled={editSaving}
                    />
                  </div>
                ) : null}
              </div>

              {editError ? <p className="text-sm text-blush">{editError}</p> : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={closeEditModal}
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={handleSaveProfile}
                  disabled={editSaving}
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
