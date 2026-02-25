export default function Hero({ totalEndpoints }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-8">
      <div className="space-y-3">
        <p className="tag bg-ink text-white">MediConnect</p>
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          Control Room for Microservices
        </h1>
        <p className="max-w-2xl text-sm text-slateblue/80">
          Explore every API endpoint across Auth, User, Consultation, Medicine,
          and Payment services. Fill in fields and fire requests instantly.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="glass rounded-2xl px-4 py-3 text-sm text-slateblue shadow-card">
          Environment: Localhost
        </div>
        <div className="glass rounded-2xl px-4 py-3 text-sm text-slateblue shadow-card">
          API Coverage: {totalEndpoints} endpoints
        </div>
      </div>
    </div>
  );
}
