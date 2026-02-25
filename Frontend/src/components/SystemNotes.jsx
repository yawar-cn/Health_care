export default function SystemNotes({ notes }) {
  return (
    <section id="system" className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            System Notes
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slateblue/80">
            Non-HTTP services that are part of the flow.
          </p>
        </div>
        <div className="tag bg-mist text-slateblue rounded-full px-4 py-2 text-xs font-semibold">
          Supporting services
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {notes.map((note) => (
          <div key={note.title} className="section-card">
            <h3 className="font-display text-lg font-semibold text-ink">
              {note.title}
            </h3>
            <p className="mt-2 text-sm text-slateblue/80">
              {note.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
