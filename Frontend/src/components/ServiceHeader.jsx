export default function ServiceHeader({ title, description, accent }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slateblue/80">
          {description}
        </p>
      </div>
      <div className={`tag ${accent} rounded-full px-4 py-2 text-xs font-semibold`}>
        Live endpoints
      </div>
    </div>
  );
}
