export default function FieldInput({ field, value, onChange }) {
  const { name, type, in: location, helper } = field;
  const label = `${name}${location ? ` (${location})` : ""}`;

  const handleChange = (event) => {
    if (type === "boolean") {
      onChange(name, event.target.checked);
    } else {
      onChange(name, event.target.value);
    }
  };

  let control = (
    <input
      className="input"
      value={value ?? ""}
      onChange={handleChange}
      placeholder={name}
      type={type === "number" ? "number" : "text"}
    />
  );

  if (type === "list-number" || type === "list-string") {
    control = (
      <input
        className="input"
        value={value ?? ""}
        onChange={handleChange}
        placeholder="Comma-separated values"
        type="text"
      />
    );
  }

  if (type === "boolean") {
    control = (
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span className="text-ink">{name}</span>
      </label>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
        {label}
      </label>
      {control}
      {helper ? <p className="text-xs text-dusk/70">{helper}</p> : null}
    </div>
  );
}
