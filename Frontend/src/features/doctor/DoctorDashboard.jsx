import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { useAuthStore } from "../../store/useAuthStore";

export default function DoctorDashboard() {
  const notifications = useAuthStore((state) => state.notifications);
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Doctor Dashboard"
        subtitle="Manage assigned consultations and prescriptions."
        action={
          <Link to="/doctor/consultations" className="button">
            View Consultations
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending Consultations" value="--" />
        <StatCard label="Prescriptions" value="--" />
        <StatCard label="Unread Alerts" value={unread} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-ink">Today's queue</h3>
          <p className="text-sm text-dusk/70">
            Review and accept pending consultations to keep patients informed.
          </p>
          <Link className="button-secondary" to="/doctor/consultations">
            Manage consultations
          </Link>
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-ink">Clinical notes</h3>
          <p className="text-sm text-dusk/70">
            Upload prescriptions and share guidance with patients.
          </p>
          <Link className="button-secondary" to="/medical-records">
            Medical records
          </Link>
        </div>
      </div>
    </div>
  );
}
