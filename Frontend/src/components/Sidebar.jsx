import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getNavItems } from "../routes/navConfig";

export default function Sidebar() {
  const { role } = useAuth();
  const items = getNavItems(role);

  return (
    <aside className="hidden w-64 flex-col border-r border-white/60 bg-white/70 px-6 py-8 backdrop-blur lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
          MC
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">MediConnect</p>
          <p className="text-xs text-dusk/70">Healthcare Console</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-ink text-white"
                  : "text-dusk hover:bg-white hover:text-ink"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-ink/90 p-4 text-xs text-white">
        Secure by design · HIPAA-ready workflow
      </div>
    </aside>
  );
}
