export const NAV_ITEMS = {
  PATIENT: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Profile", to: "/patient/profile" },
    { label: "Book Consultation", to: "/appointments/book" },
    { label: "Appointments", to: "/patient/appointments" },
    { label: "Payments", to: "/payments" },
    { label: "Payment History", to: "/patient/payments" },
    { label: "Medical Records", to: "/medical-records" },
    { label: "Notifications", to: "/notifications" }
  ],
  DOCTOR: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Profile", to: "/doctor/profile" },
    { label: "Consultations", to: "/doctor/consultations" },
    { label: "Medical Records", to: "/medical-records" },
    { label: "Notifications", to: "/notifications" }
  ],
  ADMIN: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Users", to: "/admin" },
    { label: "Payments", to: "/admin" },
    { label: "System Stats", to: "/admin" },
    { label: "Notifications", to: "/notifications" }
  ]
};

export const getNavItems = (role) => {
  if (!role) return [];
  return NAV_ITEMS[role] || [];
};
