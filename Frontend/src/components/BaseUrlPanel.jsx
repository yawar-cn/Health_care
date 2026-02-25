export default function BaseUrlPanel({ bases, fields, onChange }) {
  return (
    <div className="section-card space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink">
        Service Base URLs
      </h2>
      <p className="text-sm text-slateblue/80">
        Update ports or hostnames if your services are running elsewhere.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-slateblue">
              {field.label}
            </label>
            <input
              className="input"
              value={bases[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
