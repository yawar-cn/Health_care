export default function StatCard({ label, value, hint }) {
  return (
    <div className="card space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      {hint ? <p className="text-xs text-dusk/70">{hint}</p> : null}
    </div>
  );
}
