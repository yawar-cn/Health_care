import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ProfilePage from "../features/patient/ProfilePage";
import AppointmentHistoryPage from "../features/patient/AppointmentHistoryPage";
import PaymentHistoryPage from "../features/patient/PaymentHistoryPage";
import AppointmentFlowPage from "../features/appointments/AppointmentFlowPage";
import ConsultationsPage from "../features/doctor/ConsultationsPage";
import ConsultationDetailPage from "../features/doctor/ConsultationDetailPage";
import PaymentFlowPage from "../features/payments/PaymentFlowPage";
import PaymentVerifyPage from "../features/payments/PaymentVerifyPage";
import PaymentResultPage from "../features/payments/PaymentResultPage";
import MedicalRecordsPage from "../features/medical-records/MedicalRecordsPage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import NotFoundPage from "../features/notifications/NotFoundPage";
import AdminDashboard from "../features/admin/AdminDashboard";
import DashboardRouter from "./DashboardRouter";
import { useAuth } from "../hooks/useAuth";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardRouter />} />

        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <AppointmentHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/payments"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PaymentHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/book"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <AppointmentFlowPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/consultations"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <ConsultationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consultations/:id"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <ConsultationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PaymentFlowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/verify"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PaymentVerifyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/result/:status"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PaymentResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical-records"
          element={
            <ProtectedRoute roles={["PATIENT", "DOCTOR"]}>
              <MedicalRecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["PATIENT", "DOCTOR", "ADMIN"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
