import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { useAuthStore } from "../../store/useAuthStore";

export default function PatientDashboard() {
  const appointments = useAuthStore((state) => state.appointments);
  const payments = useAuthStore((state) => state.payments);
  const notifications = useAuthStore((state) => state.notifications);
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patient Dashboard"
        subtitle="Manage consultations, payments, and health updates."
        action={
          <Link to="/appointments/book" className="button">
            Book Consultation
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Appointments" value={appointments.length} />
        <StatCard label="Payments" value={payments.length} />
        <StatCard label="Unread Alerts" value={unread} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-ink">Upcoming actions</h3>
          <p className="text-sm text-dusk/70">
            Review recent consultations and pending payments.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link className="button-secondary" to="/patient/appointments">
              View appointments
            </Link>
            <Link className="button-secondary" to="/patient/payments">
              View payments
            </Link>
            <Link className="button-secondary" to="/notifications">
              Notifications
            </Link>
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-ink">Health summary</h3>
          <p className="text-sm text-dusk/70">
            Access digital prescriptions and follow-ups from your care team.
          </p>
          <Link className="button-secondary" to="/medical-records">
            Medical records
          </Link>
        </div>
      </div>
    </div>
  );
}
