import { useUi } from "../hooks/useUi";

export default function GlobalStatus() {
  const { loadingCount, globalError, clearError } = useUi();

  return (
    <>
      {loadingCount > 0 ? (
        <div className="fixed inset-x-0 top-0 z-50 h-1 bg-ink/10">
          <div className="h-full w-1/2 animate-pulse bg-mint" />
        </div>
      ) : null}
      {globalError ? (
        <div className="fixed right-6 top-6 z-50 max-w-md rounded-2xl border border-blush/40 bg-white px-4 py-3 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Something went wrong</p>
              <p className="text-xs text-dusk/80">{globalError}</p>
            </div>
            <button className="text-xs text-dusk" onClick={clearError}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
