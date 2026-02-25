import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "../features/admin/AdminDashboard";
import DoctorDashboard from "../features/doctor/DoctorDashboard";
import PatientDashboard from "../features/patient/PatientDashboard";

export default function DashboardRouter() {
  const { role } = useAuth();

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }
  if (role === "DOCTOR") {
    return <DoctorDashboard />;
  }
  return <PatientDashboard />;
}
