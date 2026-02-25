export default function LoadingIndicator({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-dusk">
      <div className="h-2 w-2 animate-pulse rounded-full bg-mint" />
      <span>{label}</span>
    </div>
  );
}
