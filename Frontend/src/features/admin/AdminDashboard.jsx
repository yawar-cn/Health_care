import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor platform usage, payments, and system health."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value="--" hint="Endpoint pending" />
        <StatCard label="Payments" value="--" hint="Endpoint pending" />
        <StatCard label="System Health" value="Stable" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-semibold text-ink">User Overview</h3>
          <p className="text-sm text-dusk/70">
            User management endpoints are not available in the current backend.
          </p>
        </div>
        <div className="card space-y-2">
          <h3 className="text-lg font-semibold text-ink">Payment Insights</h3>
          <p className="text-sm text-dusk/70">
            Aggregated payment metrics will appear here when reporting endpoints
            are implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
