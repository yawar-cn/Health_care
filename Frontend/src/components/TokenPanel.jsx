export default function TokenPanel({ token, onChange, onClear }) {
  return (
    <div className="section-card space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink">
        Authorization Token
      </h2>
      <p className="text-sm text-slateblue/80">
        Paste a JWT token to be sent as a Bearer token for secured endpoints.
      </p>
      <textarea
        rows={6}
        className="input resize-none"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        value={token}
        onChange={(event) => onChange(event.target.value)}
      />
      <button className="button-outline" onClick={onClear}>
        Clear Token
      </button>
    </div>
  );
}
