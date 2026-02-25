import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialNotifications = [
  {
    id: "welcome",
    title: "Welcome to MediConnect",
    message: "Your healthcare workspace is ready.",
    read: false,
    createdAt: new Date().toISOString()
  }
];

const getUserKey = (user) => {
  if (user?.id != null) {
    return `id:${user.id}`;
  }
  if (user?.email) {
    return `email:${user.email}`;
  }
  return null;
};

const PAYMENT_STORAGE_PREFIX = "mediconnect-payments:";

const readPaymentsFromStorage = (userKey) => {
  if (!userKey || typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(`${PAYMENT_STORAGE_PREFIX}${userKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const writePaymentsToStorage = (userKey, payments) => {
  if (!userKey || typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      `${PAYMENT_STORAGE_PREFIX}${userKey}`,
      JSON.stringify(payments || [])
    );
  } catch (error) {
    // Ignore storage failures (private mode/quota).
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      appointments: [],
      payments: [],
      paymentsByUser: {},
      notifications: initialNotifications,
      setAuth: (token, user) =>
        set((state) => {
          const userKey = getUserKey(user);
          const inMemoryPayments = userKey ? state.paymentsByUser[userKey] : [];
          const storagePayments =
            !inMemoryPayments || inMemoryPayments.length === 0
              ? readPaymentsFromStorage(userKey)
              : inMemoryPayments;
          return {
            token,
            user,
            role: user?.role || null,
            payments: storagePayments || [],
            paymentsByUser: userKey
              ? {
                  ...state.paymentsByUser,
                  [userKey]: storagePayments || []
                }
              : state.paymentsByUser
          };
        }),
      updateUser: (updates) =>
        set((state) => {
          const nextUser = { ...(state.user || {}), ...(updates || {}) };
          return {
            user: nextUser,
            role: nextUser?.role || state.role
          };
        }),
      clearAuth: () =>
        set((state) => {
          const userKey = getUserKey(state.user);
          const paymentsByUser = userKey
            ? { ...state.paymentsByUser, [userKey]: state.payments }
            : state.paymentsByUser;
          writePaymentsToStorage(userKey, state.payments);
          return {
            token: null,
            user: null,
            role: null,
            appointments: [],
            payments: [],
            paymentsByUser,
            notifications: initialNotifications
          };
        }),
      addAppointment: (appointment) =>
        set({ appointments: [...get().appointments, appointment] }),
      setAppointments: (appointments) => set({ appointments }),
      addPayment: (payment) =>
        set((state) => {
          const payments = [...state.payments, payment];
          const userKey = getUserKey(state.user);
          writePaymentsToStorage(userKey, payments);
          return {
            payments,
            paymentsByUser: userKey
              ? { ...state.paymentsByUser, [userKey]: payments }
              : state.paymentsByUser
          };
        }),
      setPayments: (payments) =>
        set((state) => {
          const userKey = getUserKey(state.user);
          writePaymentsToStorage(userKey, payments);
          return {
            payments,
            paymentsByUser: userKey
              ? { ...state.paymentsByUser, [userKey]: payments }
              : state.paymentsByUser
          };
        }),
      addNotification: (notification) =>
        set({ notifications: [notification, ...get().notifications] }),
      markNotificationRead: (id) =>
        set({
          notifications: get().notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item
          )
        })
    }),
    { name: "mediconnect-auth" }
  )
);
