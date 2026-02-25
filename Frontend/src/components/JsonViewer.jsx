export default function JsonViewer({ data }) {
  return (
    <pre className="max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-ink">
      {data ? JSON.stringify(data, null, 2) : "No data"}
    </pre>
  );
}
