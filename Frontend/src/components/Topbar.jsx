import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUiStore } from "../store/useUiStore";
import { getNavItems } from "../routes/navConfig";

export default function Topbar() {
  const { user, role, clearAuth } = useAuth();
  const navigate = useNavigate();
  const items = getNavItems(role);

  const handleLogout = () => {
    clearAuth();
    useUiStore.getState().clearError();
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/60 bg-white/70 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
          {role || "Guest"}
        </p>
        <p className="text-lg font-semibold text-ink">
          {user?.name || "Welcome"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="input w-48 lg:hidden"
          onChange={(event) => event.target.value && navigate(event.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Navigate
          </option>
          {items.map((item) => (
            <option key={item.to} value={item.to}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="hidden rounded-full bg-frost px-3 py-1 text-xs text-dusk lg:inline">
          {user?.email || ""}
        </span>
        <button className="button-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
