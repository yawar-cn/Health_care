import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-frost to-stone">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-ink px-4 py-2 text-white">
              <span className="text-sm font-semibold">MediConnect</span>
            </div>
            <h1 className="font-display text-4xl font-semibold text-ink">
              Modern healthcare management in one workspace.
            </h1>
            <p className="text-sm text-dusk/80">
              Secure consultations, payments, and patient journeys in a streamlined
              experience tailored for clinics and hospitals.
            </p>
            <div className="card">
              <p className="text-sm text-dusk/80">
                Role-based access, appointment orchestration, and digital records
                ready for your team.
              </p>
            </div>
          </div>
          <div className="card">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
