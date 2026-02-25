import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Endpoints" },
  { to: "/flows/consultation", label: "Consultation Flow" },
  { to: "/flows/payment", label: "Payment Flow" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">
            MC
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">MediConnect</p>
            <p className="text-xs text-dusk/70">Frontend Console</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `tag border border-transparent px-4 py-2 text-[11px] transition ${
                  isActive
                    ? "bg-ink text-white"
                    : "bg-white/70 text-dusk hover:border-ink/10 hover:bg-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
