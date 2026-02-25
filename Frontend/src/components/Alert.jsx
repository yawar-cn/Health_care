export default function Alert({ type = "info", title, description }) {
  const styles = {
    info: "border-ocean/30 bg-ocean/10 text-ink",
    success: "border-mint/40 bg-mint/15 text-ink",
    error: "border-blush/40 bg-blush/15 text-ink"
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[type] || styles.info}`}>
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      {description ? (
        <p className="mt-1 text-sm text-dusk/80">{description}</p>
      ) : null}
    </div>
  );
}
